import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as webpush from 'web-push';

/** Datenbankzugang mit vollen Rechten. Läuft nur auf dem Server. */
export function admin(): SupabaseClient {
  const url = 'https://jmgkdairimxbhqivqovo.supabase.co';
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error('SUPABASE_SECRET_KEY fehlt in den Umgebungsvariablen.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function nurPost(req: VercelRequest, res: VercelResponse): boolean {
  if (req.method === 'POST') return true;
  res.status(405).json({ fehler: 'Nur POST ist erlaubt.' });
  return false;
}

export function koerper(req: VercelRequest): Record<string, unknown> {
  if (req.body && typeof req.body === 'object') return req.body as Record<string, unknown>;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return {};
}

export function serverFehler(res: VercelResponse, e: unknown): void {
  console.error(e);
  res.status(500).json({ fehler: e instanceof Error ? e.message : 'Unbekannter Fehler auf dem Server.' });
}

/** Ist der Aufrufer der angemeldete Besitzer der App? */
export async function istBesitzer(req: VercelRequest, db: SupabaseClient): Promise<boolean> {
  const kopf = req.headers.authorization;
  const token = kopf && kopf.startsWith('Bearer ') ? kopf.slice(7) : null;
  if (!token) return false;
  const { data, error } = await db.auth.getUser(token);
  if (error || !data.user) return false;
  const { data: b } = await db.from('besitzer').select('user_id').eq('user_id', data.user.id).maybeSingle();
  return !!b;
}

/**
 * VAPID-Schlüssel für Web-Push. Sie entstehen beim ersten Aufruf auf dem Server und liegen
 * dann in der Tabelle einstellungen, die nur der Server lesen kann. Der private Schlüssel
 * verlässt den Server nie.
 */
export async function vapidSchluessel(db: SupabaseClient): Promise<{ pub: string; priv: string }> {
  const { data, error } = await db.from('einstellungen').select('schluessel, wert').in('schluessel', ['vapid_public', 'vapid_private']);
  if (error) throw error;
  const m = Object.fromEntries((data ?? []).map((z: { schluessel: string; wert: string }) => [z.schluessel, z.wert]));
  if (m.vapid_public && m.vapid_private) return { pub: m.vapid_public, priv: m.vapid_private };
  const neu = webpush.generateVAPIDKeys();
  const { error: e2 } = await db.from('einstellungen').upsert(
    [
      { schluessel: 'vapid_public', wert: neu.publicKey },
      { schluessel: 'vapid_private', wert: neu.privateKey },
    ],
    { onConflict: 'schluessel', ignoreDuplicates: true },
  );
  if (e2) throw e2;
  const { data: d2, error: e3 } = await db.from('einstellungen').select('schluessel, wert').in('schluessel', ['vapid_public', 'vapid_private']);
  if (e3) throw e3;
  const m2 = Object.fromEntries((d2 ?? []).map((z: { schluessel: string; wert: string }) => [z.schluessel, z.wert]));
  return { pub: m2.vapid_public, priv: m2.vapid_private };
}

async function vorbereiten(db: SupabaseClient): Promise<void> {
  const { pub, priv } = await vapidSchluessel(db);
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:domlin88@gmail.com', pub, priv);
}

export interface Nachricht {
  title: string;
  body: string;
  tag?: string;
  url?: string;
}

/** Schickt eine Nachricht an alle registrierten Geräte. Abgemeldete Geräte werden entfernt. */
export async function pushAnAlle(db: SupabaseClient, n: Nachricht): Promise<{ gesendet: number; fehlgeschlagen: number }> {
  await vorbereiten(db);
  const { data, error } = await db.from('push_abos').select('id, endpoint, p256dh, auth');
  if (error) throw error;
  let gesendet = 0;
  let fehlgeschlagen = 0;
  for (const abo of (data ?? []) as { id: string; endpoint: string; p256dh: string; auth: string }[]) {
    try {
      await webpush.sendNotification(
        { endpoint: abo.endpoint, keys: { p256dh: abo.p256dh, auth: abo.auth } },
        JSON.stringify({ url: '/', ...n }),
      );
      gesendet++;
    } catch (e) {
      fehlgeschlagen++;
      const status = (e as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) await db.from('push_abos').delete().eq('id', abo.id);
      else console.error('Push fehlgeschlagen', status, e);
    }
  }
  return { gesendet, fehlgeschlagen };
}
