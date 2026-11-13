# Kona

Dominics Trainings-App auf dem Weg nach Kona 2029: Tagesplan, Kraft-Logbuch, Kurs nach Roth und Kona, Rennen und Tests. Installierbar auf dem Handy, der Morgen-Check-in kommt als Benachrichtigung.

## Aufbau

| Ordner | Inhalt |
|---|---|
| `index.html`, `src/` | Die App im Browser. `src/app.js` ist die App selbst (aus dem Claude-Artefakt „Kona Heute“ übernommen), `src/db.js` verbindet sie mit Supabase, `src/main.js` regelt Anmeldung und Push. |
| `public/` | Symbole, Manifest und Service Worker für die installierbare App |
| `api/` | Server-Funktionen bei Vercel: `push-senden` (wird von der Datenbank aufgerufen) und `push-test` |
| `supabase/schema.sql` | Tabellen, Zugriffsregeln und der Push-Trigger |

## Datenmodell

Alle Trainingsdaten liegen als Dokumente in einer Tabelle `docs (coll, id, data)`:

| coll | id | Inhalt | schreibt |
|---|---|---|---|
| `plan` | Datum | Tagesplan mit Einheiten | Coach, Dominic beim Verschieben |
| `answers` | Datum | Befinden, Beschwerden, RPE, Notiz, erledigt oder ausgefallen | nur Dominic |
| `log` | `Datum_A` usw. | Kraft und Mobility mit Sätzen und Gewichten | Dominic |
| `daily` | Datum | Ampel, Hinweis, Garmin-Werte, Strava-Einheiten | Check-in |
| `races` | Kürzel | Rennen und Tests mit Ziel und Ergebnis | Dominic und Coach |
| `meta` | `targets`, `course` | Zielgewichte, Stand und Ziele je Disziplin | Coach |

Eine neue Zeile in `nachrichten (titel, text)` löst über einen Datenbank-Trigger eine Push-Nachricht aufs Handy aus.

## Einrichten

1. **Supabase:** Projekt „kona“ anlegen. `supabase/schema.sql` im SQL Editor einmal ausführen.
2. **Vercel:** dieses Repo importieren. Die Umgebungsvariablen aus `.env.example` eintragen:
   - `VITE_SUPABASE_URL` und `SUPABASE_URL`: Project URL aus Supabase.
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Publishable Key aus Supabase.
   - `SUPABASE_SECRET_KEY`: Secret Key aus Supabase. Geheim.
   - VAPID-Schlüssel braucht es nicht, der Server erzeugt sie beim ersten Push selbst und legt sie in `einstellungen` ab.
   - `VAPID_SUBJECT`: optional, Standard ist `mailto:domlin88@gmail.com`.
3. **Konto:** die App öffnen und mit „Ich habe noch kein Konto“ registrieren. Das erste Konto wird automatisch der Besitzer, alle späteren sehen nichts. Danach in Supabase unter Authentication die Registrierung neuer Nutzer abschalten.
4. **Push-Trigger:** in Supabase einmal ausführen, mit der echten Adresse. Das Geheimnis entsteht in der Datenbank und muss nirgends abgetippt werden:
   ```sql
   insert into einstellungen (schluessel, wert) values
     ('app_url', 'https://DEINE-APP.vercel.app'),
     ('push_geheimnis', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''))
   on conflict (schluessel) do update set wert = excluded.wert;
   ```
5. **Handy:** App öffnen, zum Startbildschirm hinzufügen, aus dem Symbol starten und Benachrichtigungen einschalten.

## Lokal starten

```
npm install
npm run dev
```
