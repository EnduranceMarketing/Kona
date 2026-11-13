import type { VercelRequest, VercelResponse } from '@vercel/node';
import { admin, serverFehler, vapidSchluessel } from './_lib.js';

/** Liefert den öffentlichen VAPID-Schlüssel, den das Handy für das Push-Abo braucht. */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const { pub } = await vapidSchluessel(admin());
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ schluessel: pub });
  } catch (e) {
    return serverFehler(res, e);
  }
}
