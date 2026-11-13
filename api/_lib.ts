import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as webpush from 'web-push';

/** Datenbankzugang mit vollen Rechten. Läuft nur auf dem Server. */
export function admin(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL oder SUPABASE_SECRET_KEY fehlt in den Umgebungsvariablen.');
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

let bereit = false;
function vorbereiten(): void {
  if (bereit) return;
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const sub = process.env.VAPID_SUBJECT || 'mailto:domlin88@gmail.com';
  if (!pub || !priv) throw new Error('Die VAPID-Schlüssel fehlen in den Umgebungsvariablen.');
  webpush.setVapidDetails(sub, pub, priv);
  bereit = true;
}

export interface Nachricht {
  title: string;
  body: string;
  tag?: string;
  url?: string;
}

/** Schickt eine Nachricht an alle registrierten Geräte. Abgemeldete Geräte werden entfernt. */
export async function pushAnAlle(db: SupabaseClient, n: Nachricht): Promise<{ gesendet: number; fehlgeschlagen: number }> {
  vorbereiten();
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
