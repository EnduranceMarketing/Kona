import type { VercelRequest, VercelResponse } from '@vercel/node';
import { admin, istBesitzer, nurPost, pushAnAlle, serverFehler } from './_lib.js';

/** Testnachricht an die eigenen Geräte, ausgelöst aus der App. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!nurPost(req, res)) return;
  try {
    const db = admin();
    if (!(await istBesitzer(req, db))) return res.status(401).json({ fehler: 'Nicht angemeldet.' });
    const r = await pushAnAlle(db, {
      title: 'Kona',
      body: 'Die Benachrichtigungen funktionieren. Ab morgen kommt hier dein Check-in.',
      tag: 'kona-test',
    });
    return res.status(200).json(r);
  } catch (e) {
    return serverFehler(res, e);
  }
}
