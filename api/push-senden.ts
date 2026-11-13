import type { VercelRequest, VercelResponse } from '@vercel/node';
import { admin, koerper, nurPost, pushAnAlle, serverFehler } from './_lib.js';

/**
 * Wird von der Datenbank aufgerufen, sobald in "nachrichten" eine neue Zeile steht
 * (zum Beispiel der Morgen-Check-in). Geschützt mit dem Geheimnis aus
 * einstellungen.push_geheimnis; die Umgebungsvariable PUSH_GEHEIMNIS wird
 * zusätzlich akzeptiert, ist aber nicht nötig.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!nurPost(req, res)) return;
  try {
    const db = admin();
    const { data: e } = await db.from('einstellungen').select('wert').eq('schluessel', 'push_geheimnis').maybeSingle();
    const erlaubt = [e?.wert, process.env.PUSH_GEHEIMNIS].filter((g): g is string => !!g && g.length >= 24);
    const kopf = req.headers.authorization || '';
    if (!erlaubt.some((g) => kopf === 'Bearer ' + g)) {
      return res.status(401).json({ fehler: 'Nicht berechtigt.' });
    }
    const id = Number(koerper(req).id);
    if (!Number.isFinite(id)) return res.status(400).json({ fehler: 'Die Nachricht fehlt.' });

    const { data: n, error } = await db.from('nachrichten').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!n) return res.status(404).json({ fehler: 'Diese Nachricht gibt es nicht.' });
    if (n.gesendet_am) return res.status(200).json({ schon: true });

    const r = await pushAnAlle(db, { title: n.titel, body: n.text, url: n.url || '/', tag: 'kona-' + id });
    await db
      .from('nachrichten')
      .update({ gesendet_am: new Date().toISOString(), ergebnis: `${r.gesendet} gesendet, ${r.fehlgeschlagen} fehlgeschlagen` })
      .eq('id', id);
    return res.status(200).json(r);
  } catch (e) {
    return serverFehler(res, e);
  }
}
