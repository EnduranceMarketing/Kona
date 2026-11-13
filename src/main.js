// Einstieg: Anmeldung prüfen, dann die App laden.
import { createClient } from '@supabase/supabase-js';
import { makeDb } from './db.js';
import { istInstalliert, istIOS, pushAktiv, pushEinschalten, pushMoeglich, pushTesten, serviceWorkerStarten } from './push.js';
import './styles.css';

// Beides ist öffentlich und darf im Code stehen. Fest eingetragen, damit ein Tippfehler bei Vercel die App nicht lahmlegt.
const URL_ = 'https://jmgkdairimxbhqivqovo.supabase.co';
const KEY = 'sb_publishable_w01mqsLB_vzmalDxp089pQ_XlEnGyFF';
const $ = (id) => document.getElementById(id);
const wrap = document.querySelector('.wrap');
const nav = document.querySelector('nav');

wrap.hidden = true;
nav.hidden = true;
void serviceWorkerStarten();

if (!URL_ || !KEY) {
  $('setup-fehlt').hidden = false;
} else {
  const sb = createClient(URL_, KEY);
  let gestartet = false;

  const starten = async () => {
    if (gestartet) return;
    gestartet = true;
    $('login').hidden = true;
    wrap.hidden = false;
    nav.hidden = false;
    const db = makeDb(sb);
    // Die App fragt die Datenbank über window.claude.use("db") an, wie früher im Claude-Artefakt.
    window.claude = { use: async (name) => (name === 'db' ? db : null) };
    await import('./app.js');
    void setupZeigen(sb);
  };

  const anmeldungZeigen = () => {
    $('login').hidden = false;
    let neu = false;
    $('login-neu').onclick = () => {
      neu = !neu;
      $('login-go').textContent = neu ? 'Konto anlegen' : 'Anmelden';
      $('login-neu').textContent = neu ? 'Ich habe schon ein Konto' : 'Ich habe noch kein Konto';
      $('login-pw').autocomplete = neu ? 'new-password' : 'current-password';
      $('login-msg').textContent = '';
    };
    $('login-form').onsubmit = async (e) => {
      e.preventDefault();
      const email = $('login-mail').value.trim();
      const password = $('login-pw').value;
      $('login-go').disabled = true;
      $('login-msg').textContent = '';
      if (neu) {
        const { data, error } = await sb.auth.signUp({ email, password });
        if (error) $('login-msg').textContent = error.message;
        else if (!data.session) $('login-msg').textContent = 'Wir haben dir eine E-Mail geschickt. Bestätige sie und melde dich danach hier an.';
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) $('login-msg').textContent = 'E-Mail oder Passwort stimmen nicht.';
      }
      $('login-go').disabled = false;
    };
  };

  sb.auth.getSession().then(({ data }) => {
    if (data.session) void starten();
    else anmeldungZeigen();
  });
  sb.auth.onAuthStateChange((_e, s) => {
    if (s) void starten();
  });
}

/* Kleine Karte oben auf der Seite: App installieren, Benachrichtigungen einschalten. */
async function setupZeigen(sb) {
  const box = $('setup');
  const karte = (titel, text, knoepfe) => {
    box.textContent = '';
    const c = document.createElement('section');
    c.className = 'card setupcard';
    const h = document.createElement('h2');
    h.textContent = titel;
    const p = document.createElement('div');
    p.className = 'hint';
    p.textContent = text;
    const acts = document.createElement('div');
    acts.className = 'acts';
    knoepfe.forEach(([label, fn, pri]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'act' + (pri ? ' pri' : '');
      b.textContent = label;
      b.onclick = fn;
      acts.append(b);
    });
    c.append(h, p, acts);
    box.append(c);
    box.hidden = false;
  };
  const weg = () => {
    try {
      localStorage.setItem('kona:setup-aus', '1');
    } catch {}
    box.hidden = true;
  };
  try {
    if (localStorage.getItem('kona:setup-aus') === '1') return;
  } catch {}

  if (!istInstalliert()) {
    karte(
      'Als App installieren',
      istIOS()
        ? 'Tippe in Safari auf Teilen und dann auf „Zum Home-Bildschirm“.'
        : 'Tippe im Browser-Menü auf „App installieren“ oder „Zum Startbildschirm hinzufügen“.',
      [['Später', weg]],
    );
    return;
  }
  if (!pushMoeglich() || (await pushAktiv())) return;
  karte('Check-in als Benachrichtigung', 'Der Check-in kommt dann jeden Morgen gegen 8:30 Uhr direkt aufs Handy.', [
    [
      'Einschalten',
      async () => {
        try {
          await pushEinschalten(sb);
          await pushTesten(sb);
          karte('Benachrichtigungen sind an', 'Eine Testnachricht ist unterwegs.', [['Schließen', () => (box.hidden = true)]]);
        } catch (e) {
          karte('Das hat nicht geklappt', e instanceof Error ? e.message : String(e), [['Schließen', () => (box.hidden = true)]]);
        }
      },
      true,
    ],
    ['Später', weg],
  ]);
}
