// Brücke zwischen der App und Supabase.
// Die App wurde als Claude-Artefakt gebaut und spricht mit einer Dokument-Datenbank:
//   db.collection("plan").orderBy("date","desc").limit(400).onSnapshot(cb, err)
//   db.doc("meta/course").onSnapshot(cb, err)
//   db.doc("answers/2026-11-13").set({...})
// Hier wird genau diese Schnittstelle auf eine einzige Supabase-Tabelle "docs" abgebildet:
//   docs(coll text, id text, data jsonb, datum text aus data->>'date', updated_at)
// Änderungen kommen live über Supabase Realtime.

function snapOf(rows) {
  return { docs: rows.map((r) => ({ id: r.id, data: () => r.data })) };
}

export function makeDb(sb) {
  const listeners = new Map(); // coll -> Set(reload)
  let channel = null;

  function ensureChannel() {
    if (channel) return;
    channel = sb
      .channel('docs-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'docs' }, (p) => {
        const coll = (p.new && p.new.coll) || (p.old && p.old.coll);
        const set = coll ? listeners.get(coll) : null;
        if (set) set.forEach((fn) => fn());
      })
      .subscribe();
  }

  function listen(coll, fn) {
    if (!listeners.has(coll)) listeners.set(coll, new Set());
    listeners.get(coll).add(fn);
    ensureChannel();
    return () => listeners.get(coll).delete(fn);
  }

  function debounce(fn, ms) {
    let t = null;
    return () => {
      clearTimeout(t);
      t = setTimeout(fn, ms);
    };
  }

  function collection(coll) {
    const q = { orderDesc: true, n: 1000 };
    const api = {
      orderBy(_field, dir) {
        q.orderDesc = dir !== 'asc';
        return api;
      },
      limit(n) {
        q.n = n;
        return api;
      },
      onSnapshot(cb, onErr) {
        const load = async () => {
          const { data, error } = await sb
            .from('docs')
            .select('id,data')
            .eq('coll', coll)
            .order('datum', { ascending: !q.orderDesc, nullsFirst: false })
            .limit(q.n);
          if (error) {
            if (onErr) onErr(error);
            return;
          }
          cb(snapOf(data || []));
        };
        void load();
        return listen(coll, debounce(load, 150));
      },
    };
    return api;
  }

  function doc(path) {
    const [coll, id] = path.split('/');
    return {
      onSnapshot(cb, onErr) {
        const load = async () => {
          const { data, error } = await sb.from('docs').select('data').eq('coll', coll).eq('id', id).maybeSingle();
          if (error) {
            if (onErr) onErr(error);
            return;
          }
          cb({ exists: !!data, data: () => (data ? data.data : undefined) });
        };
        void load();
        return listen(coll, debounce(load, 150));
      },
      async get() {
        const { data, error } = await sb.from('docs').select('data').eq('coll', coll).eq('id', id).maybeSingle();
        if (error) throw error;
        return { exists: !!data, data: () => (data ? data.data : undefined) };
      },
      async set(body) {
        const { error } = await sb
          .from('docs')
          .upsert({ coll, id, data: body, updated_at: new Date().toISOString() }, { onConflict: 'coll,id' });
        if (error) {
          const e = new Error(error.message);
          e.code = error.code;
          throw e;
        }
      },
    };
  }

  return { collection, doc };
}
