// Benachrichtigungen: Service Worker, Push-Abo anlegen und in Supabase speichern.

async function vapidHolen() {
  const r = await fetch('/api/vapid-key', { cache: 'no-store' });
  const j = await r.json().catch(() => null);
  if (!r.ok || !j?.schluessel) throw new Error((j && j.fehler) || 'Der Server liefert keinen Push-Schlüssel.');
  return j.schluessel;
}

export function istIOS() {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1);
}

export function istInstalliert() {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
}

export function pushMoeglich() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

export async function serviceWorkerStarten() {
  if (!('serviceWorker' in navigator)) return;
  try {
    await navigator.serviceWorker.register('/sw.js');
  } catch (e) {
    console.error('Service Worker konnte nicht starten', e);
  }
}

function schluesselBytes(base64) {
  const s = (base64 + '='.repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  const roh = atob(s);
  const bytes = new Uint8Array(roh.length);
  for (let i = 0; i < roh.length; i++) bytes[i] = roh.charCodeAt(i);
  return bytes;
}

function geraeteName() {
  const ua = navigator.userAgent;
  if (/iPhone/.test(ua)) return 'iPhone';
  if (/Android/.test(ua)) return /Mobile/.test(ua) ? 'Android-Handy' : 'Android-Tablet';
  return 'Computer';
}

export async function pushAktiv() {
  if (!pushMoeglich() || Notification.permission !== 'granted') return false;
  const reg = await navigator.serviceWorker.getRegistration();
  if (!reg) return false;
  return (await reg.pushManager.getSubscription()) !== null;
}

export async function pushEinschalten(sb) {
  if (!pushMoeglich()) throw new Error('Dieses Gerät unterstützt hier keine Benachrichtigungen.');
  const erlaubnis = await Notification.requestPermission();
  if (erlaubnis !== 'granted') {
    throw new Error('Die Benachrichtigungen wurden nicht erlaubt. Du kannst das in den Einstellungen des Handys ändern.');
  }
  const reg = await navigator.serviceWorker.ready;
  const abo =
    (await reg.pushManager.getSubscription()) ??
    (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: schluesselBytes(await vapidHolen()) }));
  const d = abo.toJSON();
  if (!d.endpoint || !d.keys?.p256dh || !d.keys?.auth) throw new Error('Das Handy hat kein vollständiges Push-Abo geliefert.');
  const { error } = await sb
    .from('push_abos')
    .upsert({ endpoint: d.endpoint, p256dh: d.keys.p256dh, auth: d.keys.auth, geraet: geraeteName() }, { onConflict: 'endpoint' });
  if (error) throw new Error('Das Abo konnte nicht gespeichert werden: ' + error.message);
}

export async function pushTesten(sb) {
  const { data } = await sb.auth.getSession();
  const token = data.session?.access_token;
  const r = await fetch('/api/push-test', { method: 'POST', headers: token ? { Authorization: 'Bearer ' + token } : {} });
  let j = null;
  try {
    j = await r.json();
  } catch {
    j = null;
  }
  if (!r.ok) throw new Error((j && j.fehler) || 'Der Server antwortet mit Fehler ' + r.status + '.');
  return j;
}
