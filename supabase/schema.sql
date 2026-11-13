-- Kona-App: Datenbank. Läuft einmal im Supabase-Projekt "kona" (SQL Editor oder über den Supabase-Connector).
-- Das Skript kann gefahrlos mehrfach laufen.

-- 1. Wer darf überhaupt rein? Genau ein Konto: das erste, das sich registriert.
create table if not exists public.besitzer (
  user_id uuid primary key references auth.users (id) on delete cascade,
  seit timestamptz not null default now()
);

create or replace function public.ist_besitzer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.besitzer where user_id = auth.uid())
$$;

create or replace function public.erstes_konto_wird_besitzer()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.besitzer) then
    insert into public.besitzer (user_id) values (new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists erstes_konto on auth.users;
create trigger erstes_konto after insert on auth.users
  for each row execute function public.erstes_konto_wird_besitzer();

-- 2. Alle Trainingsdaten als Dokumente, wie in der früheren Artefakt-Datenbank.
--    coll: plan, daily, answers, log, races, meta.  id: meist das Datum JJJJ-MM-TT.
create table if not exists public.docs (
  coll text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  datum text generated always as (data ->> 'date') stored,
  updated_at timestamptz not null default now(),
  primary key (coll, id)
);
create index if not exists docs_coll_datum on public.docs (coll, datum desc);

-- 3. Push-Abos der Geräte.
create table if not exists public.push_abos (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  geraet text,
  erstellt_am timestamptz not null default now()
);

-- 4. Nachrichten, die als Push aufs Handy sollen. Der Check-in trägt hier ein,
--    ein Trigger ruft dann die Vercel-Funktion /api/push-senden auf.
create table if not exists public.nachrichten (
  id bigint generated always as identity primary key,
  titel text not null,
  text text not null default '',
  url text not null default '/',
  erstellt_am timestamptz not null default now(),
  gesendet_am timestamptz,
  ergebnis text
);

-- 5. Einstellungen für den Trigger (Adresse der App und geheimer Schlüssel). Nur der Server liest sie.
create table if not exists public.einstellungen (
  schluessel text primary key,
  wert text not null
);

-- Zugriffsregeln: nur der Besitzer, Einstellungen gar nicht über die App.
alter table public.besitzer enable row level security;
alter table public.docs enable row level security;
alter table public.push_abos enable row level security;
alter table public.nachrichten enable row level security;
alter table public.einstellungen enable row level security;

drop policy if exists besitzer_lesen on public.besitzer;
create policy besitzer_lesen on public.besitzer for select using (user_id = auth.uid());

drop policy if exists docs_alles on public.docs;
create policy docs_alles on public.docs for all using (public.ist_besitzer()) with check (public.ist_besitzer());

drop policy if exists push_alles on public.push_abos;
create policy push_alles on public.push_abos for all using (public.ist_besitzer()) with check (public.ist_besitzer());

drop policy if exists nachrichten_lesen on public.nachrichten;
create policy nachrichten_lesen on public.nachrichten for select using (public.ist_besitzer());

-- Live-Updates für die App.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'docs'
  ) then
    alter publication supabase_realtime add table public.docs;
  end if;
end $$;

-- 6. Push auslösen: neue Nachricht -> HTTP-Aufruf an die App (Erweiterung pg_net).
create extension if not exists pg_net with schema extensions;

create or replace function public.nachricht_senden()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  ziel text;
  geheim text;
begin
  select wert into ziel from public.einstellungen where schluessel = 'app_url';
  select wert into geheim from public.einstellungen where schluessel = 'push_geheimnis';
  if ziel is null or geheim is null then
    update public.nachrichten set ergebnis = 'app_url oder push_geheimnis fehlt in einstellungen' where id = new.id;
    return new;
  end if;
  perform net.http_post(
    url := ziel || '/api/push-senden',
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || geheim),
    body := jsonb_build_object('id', new.id)
  );
  return new;
end;
$$;

drop trigger if exists nachricht_neu on public.nachrichten;
create trigger nachricht_neu after insert on public.nachrichten
  for each row execute function public.nachricht_senden();

-- Funktionen nicht über die öffentliche API aufrufbar machen
revoke execute on function public.erstes_konto_wird_besitzer() from public, anon, authenticated;
revoke execute on function public.nachricht_senden() from public, anon, authenticated;
revoke execute on function public.ist_besitzer() from public, anon;
grant execute on function public.ist_besitzer() to authenticated;
