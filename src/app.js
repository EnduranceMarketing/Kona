// Die App selbst. Sie spricht über window.claude.use("db") mit der Datenbank (siehe db.js).
const UNITS = {
  A:{name:"Unterkörper Kraft", short:"Beine", min:55, ex:[
    {id:"squat",how:["Füße schulterbreit, Fußspitzen leicht nach außen.", "Hüfte nach hinten und unten, Knie folgen den Zehen.", "Rücken neutral, Druck über den ganzen Fuß, aus der Hüfte hochdrücken."],q:"Kniebeuge Langhantel richtige Ausführung",n:"Kniebeuge",s:4,r:"5",kg:40,step:2.5,h:"Nur wenn Kreuzbein und Oberschenkel ruhig sind. Ziel bis März 65–75 kg."},
    {id:"bss",how:["Hinterer Fuß auf der Bank, vorderer Fuß weit genug vorn.", "Senkrecht nach unten, vorderes Knie bleibt über dem Fuß.", "Oberkörper leicht nach vorn, aus der vorderen Ferse hochdrücken."],q:"Bulgarian Split Squat Ausführung",n:"Bulgarischer Split Squat",s:3,r:"5 / Seite",kg:20,step:2,phys:1,h:"Später 3 × 8. Steigern nur mit Physio."},
    {id:"rdl",how:["Auf einem Bein, Knie leicht gebeugt.", "Hüfte nach hinten schieben, freies Bein streckt sich nach hinten.", "Becken bleibt waagerecht, nicht aufdrehen. Langsam zurück."],q:"einbeiniges rumänisches Kreuzheben Ausführung",n:"Rumänisches Kreuzheben einbeinig",s:3,r:"6–8 / Seite",kg:12,step:2,per:"2 ×",h:"Hüfte gerade halten."},
    {id:"calf",how:["Auf einer Stufe, Ferse hängt frei.", "Ganz hoch auf den Ballen, kurz halten.", "3 Sekunden ablassen bis unter Stufenniveau."],q:"einbeiniges Wadenheben Stufe Ausführung",n:"Wadenheben gestreckt",s:3,r:"8–10 / Seite",kg:12,step:2,h:"Einbeinig, langsam ablassen."},
    {id:"calfs",how:["Sitzend, Knie 90 Grad, Gewicht auf den Oberschenkeln.", "Fersen so hoch wie möglich, kurz halten.", "Langsam ablassen, volle Dehnung."],q:"Wadenheben sitzend Soleus Ausführung",n:"Wadenheben sitzend",s:3,r:"10–12",kg:25,step:2.5,h:"Schollenmuskel, wichtig für Trail und Bergab."},
    {id:"cph",how:["Seitstütz, oberes Knie auf der Bank, unteres Bein frei.", "Hüfte anheben, Körper in einer Linie.", "Halten, ruhig atmen. Später mit gestrecktem Bein auf der Bank."],q:"Copenhagen Plank Anfänger Ausführung",n:"Copenhagen Plank",s:3,r:"20–30 s / Seite",kg:null,txt:"Knie gestützt",h:"Adduktoren. Später mit gestrecktem Bein."}
  ]},
  B:{name:"Hüfte · Becken · Rumpf", short:"Physioplan", min:50, ex:[
    {id:"9090",how:["Sitz im 90/90: vorderes und hinteres Bein je 90 Grad gebeugt.", "Hinteres Knie vom Boden anheben, Oberkörper bleibt aufrecht.", "Kurz halten, ablassen. Seite wechseln."],q:"90 90 hip lift off internal rotation",n:"90/90 Lift-offs",s:2,r:"8 / Seite",kg:null,txt:"Körpergewicht",h:"Aufwärmen. Innenrotation und Mobilität."},
    {id:"jeff",how:["Auf einer Stufe stehen, Beine gestreckt, Gewicht in den Händen.", "Langsam Wirbel für Wirbel nach unten einrollen, Kinn zuerst.", "Ebenso langsam Wirbel für Wirbel aufrollen. Leichtes Gewicht."],q:"Jefferson Curl Ausführung langsam",n:"Jefferson Curl",s:3,r:"8",kg:10,step:2,phys:1,h:"Langsam, Wirbel für Wirbel. Nie schwer und schnell."},
    {id:"slht",how:["Schulterblätter auf der Bank, ein Fuß am Boden, das andere Bein angehoben.", "Hüfte über die Ferse hochdrücken bis zur Linie Knie–Hüfte–Schulter.", "Oben kurz das Gesäß anspannen, Rippen unten lassen."],q:"einbeiniger Hip Thrust Ausführung",n:"Einbeiniger Hip Thrust",s:3,r:"8 / Seite",kg:20,step:2.5,phys:1,h:"Langhantel auf der Bank."},
    {id:"ir",how:["Kabel auf Kniehöhe, seitlich zum Turm sitzen oder stehen.", "Knie bleibt fixiert, Unterschenkel dreht nach außen (Hüfte rotiert nach innen).", "Langsam zurück, kleine Last, saubere Bewegung."],q:"hip internal rotation cable exercise",n:"Hüft-Innenrotation am Kabel",s:3,r:"12–15 / Seite",kg:2.5,step:1.25,h:"Deine Schwachstelle aus dem Kraftprofil."},
    {id:"abd",how:["Seitlich liegen, Band um die Knöchel, Körper in einer Linie.", "Oberes Bein leicht nach hinten und gestreckt anheben.", "Becken nicht nach hinten kippen, langsam ablassen."],q:"Hüftabduktion Seitenlage Theraband",n:"Hüftabduktion in Seitenlage",s:3,r:"25 / Seite",kg:null,txt:"Gelbes Band",phys:1,h:"Seitliche Hüfte."},
    {id:"hflex",how:["Auf einem Bein stehen, Band um den Fuß des anderen Beins.", "Standbein halbe Kniebeuge, gleichzeitig das andere Knie gegen das Band hochziehen.", "Becken bleibt gerade, Knie des Standbeins über dem Fuß."],q:"single leg squat hip flexion band",n:"Halbe Kniebeuge mit Hüftbeugung",s:3,r:"16 / Seite",kg:null,txt:"Gelbes Band",phys:1,h:"Hüftbeuger und Standbein."},
    {id:"stepd",how:["Auf einer Stufe stehen, ein Fuß in der Luft.", "Langsam die freie Ferse zum Boden absenken, Knie bleibt über dem Fuß.", "Nur antippen und hochdrücken, Becken waagerecht."],q:"Step Down Übung Knie Ausführung",n:"Step-downs",s:3,r:"10 / Seite",kg:0,step:2,h:"Knie über dem Fuß. Später 2 × 6 kg."},
    {id:"pallof",how:["Seitlich zum Kabel, Griff vor der Brust.", "Arme gerade nach vorn drücken, Rumpf gegen die Drehung halten.", "2 Sekunden halten, zurück. Becken und Schultern bleiben gerade."],q:"Pallof Press Ausführung",n:"Pallof Press",s:3,r:"10 / Seite",kg:7.5,step:2.5,h:"Rumpf gegen Rotation."}
  ]},
  C:{name:"Oberkörper", short:"Oberkörper", min:50, ex:[
    {id:"pull",how:["Schulterbreit greifen, aus dem Hang starten.", "Schultern zuerst nach unten ziehen, dann Brust zur Stange.", "Kontrolliert ganz ablassen."],q:"Klimmzüge richtige Ausführung",n:"Klimmzüge",s:4,r:"4–8",kg:0,step:2.5,assist:1,h:"Frei, 1–2 Wdh. Reserve. Hilfe nur, wenn ein Satz unter 4 Wdh. fällt. Bei 4 × 8 frei: Zusatzgewicht."},
    {id:"bench",how:["Schulterblätter zusammen und nach unten, Füße fest am Boden.", "Stange zur unteren Brust, Ellbogen etwa 45 Grad.", "Kontrolliert drücken, Po bleibt auf der Bank."],q:"Bankdrücken richtige Ausführung",n:"Bankdrücken",s:4,r:"6–10",kg:50,step:2.5,h:"Bei 4 × 10 auf 52,5 kg."},
    {id:"row",how:["Aufrecht sitzen, Brust raus.", "Griff zum Bauch ziehen, Schulterblätter zusammen.", "Langsam nach vorn, Rücken bleibt gerade."],q:"Rudern am Kabel sitzend Ausführung",n:"Rudern am Kabel",s:3,r:"8–12",kg:40,step:2.5,h:"Oberer Rücken."},
    {id:"ohp",how:["Stehend oder sitzend, Hanteln auf Schulterhöhe.", "Über den Kopf drücken, Rumpf fest, kein Hohlkreuz.", "Kontrolliert zurück auf Schulterhöhe."],q:"Schulterdrücken Kurzhantel Ausführung",n:"Schulterdrücken Kurzhantel",s:3,r:"8–12",kg:12,step:2,per:"2 ×",h:"Schultern."},
    {id:"sapd",how:["Am Kabelturm stehen, Arme fast gestreckt, Stange oder Seil oben.", "Mit gestreckten Armen bis zu den Oberschenkeln ziehen.", "Lat anspannen, langsam zurück."],q:"straight arm pulldown Ausführung",n:"Latzug mit gestreckten Armen",s:3,r:"12–15",kg:15,step:2.5,h:"Imitiert den Kraulzug."},
    {id:"face",how:["Seil auf Gesichtshöhe.", "Zum Gesicht ziehen, Ellbogen hoch und nach außen.", "Am Ende die Hände nach hinten drehen, kurz halten."],q:"Face Pulls Ausführung",n:"Face Pulls",s:3,r:"15",kg:10,step:2.5,h:"Schultergesundheit, Aero-Haltung."},
    {id:"curl",how:["Aufrecht, Ellbogen fest am Körper.", "Hanteln ohne Schwung hochcurlen.", "Langsam ablassen."],q:"Bizeps Curls Kurzhantel Ausführung",n:"Bizeps-Curls Kurzhantel",s:3,r:"10–12",kg:8,step:2,per:"2 ×",h:"Im Wechsel mit Trizeps. Variante: Hammer-Curls."},
    {id:"tri",how:["Am Kabel, Ellbogen fest an der Seite.", "Nur die Unterarme nach unten strecken.", "Langsam zurück, Oberarme bleiben ruhig."],q:"Trizepsdrücken Kabel Ausführung",n:"Trizepsdrücken am Kabel",s:3,r:"10–12",kg:15,step:2.5,h:"Seil oder Stange. Variante: Überkopf oder Dips."}
  ]},
  M:{name:"Mobility + Liegestütze", short:"Mobility", min:15, ex:[
    {id:"m_cc",how:["Vierfüßlerstand, Hände unter den Schultern, Knie unter der Hüfte.","Rücken langsam rund machen, dann ins leichte Hohlkreuz.","Bewegung aus der Lendenwirbelsäule, ruhig atmen."],q:"lumbar cat cow",n:"Katze-Kuh (Lendenwirbelsäule)",s:1,r:"20",kg:null,txt:"Matte",phys:1,h:"Lendenwirbelsäule mobilisieren."},
    {id:"m_lx",how:["Rückenlage, Arme seitlich ausgestreckt.","Ein Bein gestreckt über das andere zur Gegenseite führen.","Schultern bleiben am Boden, zurück und Seite wechseln."],q:"lateral leg crossover supine",n:"Bein überkreuzen in Rückenlage",s:1,r:"10 / Seite",kg:null,txt:"Matte",phys:1,h:"Hüfte und unterer Rücken."},
    {id:"m_rd",how:["Mit dem Rücken an die Wand, Füße etwas vor der Wand.","Kinn zur Brust, Wirbel für Wirbel von der Wand abrollen.","Langsam Wirbel für Wirbel wieder hoch."],q:"roll down against the wall",n:"Roll down an der Wand",s:1,r:"16",kg:null,txt:"Wand",phys:1,h:"Wirbelsäule Segment für Segment."},
    {id:"m_hs",how:["Sitz mit beiden Knien 90 Grad gebeugt, Füße breit.","Beide Knie gleichzeitig zur anderen Seite kippen.","Oberkörper aufrecht, Bewegung aus der Hüfte."],q:"90 90 hip switch",n:"90/90 Hip Switch",s:2,r:"10",kg:null,txt:"Matte",phys:1,h:"Innen- und Außenrotation der Hüfte."},
    {id:"m_cc2",how:["Aus dem Kindersitz, Arme lang nach vorn.","Langsam nach vorn in die Kobra schieben, Hüfte sinkt Richtung Boden.","Zurück in den Kindersitz, fließend wechseln."],q:"child pose to cobra",n:"Kindersitz zu Kobra",s:1,r:"1 min",kg:null,txt:"Matte",phys:1,h:"Ruhig im Wechsel, 1 Minute."},
    {id:"push",how:["Hände etwas weiter als schulterbreit, Körper eine Linie von Kopf bis Ferse.","Brust bis knapp über den Boden, Ellbogen etwa 45 Grad zum Körper.","Bauch und Po fest, kein Durchhängen. Sätze über den Tag verteilen ist erlaubt."],q:"Liegestütze richtige Ausführung",n:"Liegestütze",s:4,r:"10",kg:null,txt:"über den Tag verteilt",h:"Tagesziel steigt bis 100."}
  ]}
};
const KIND = {run:"Lauf", bike:"Rad", kraft:"Kraft", mobility:"Mobility", race:"Rennen", test:"Test"};
const FEEL = [[1,"schlecht"],[2,"mäßig"],[3,"okay"],[4,"gut"],[5,"top"]];
const ISSUES = [["none","keine"],["oberschenkel","Oberschenkel links"],["kreuzbein","Kreuzbein"],["huefte","Hüfte"],["erkaeltung","Erkältung"],["magen","Magen"],["sonstiges","anderes"]];
const AMPEL = {gruen:"Grün", gelb:"Gelb", rot:"Rot"};
const BLOCK_START_ISO = "2026-11-09", BLOCK_WEEKS = 12;
const WD = ["So","Mo","Di","Mi","Do","Fr","Sa"];
const WDL = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];

/* ---------- dates and small helpers ---------- */
const pad = n => String(n).padStart(2,"0");
const iso = d => d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const parse = s => { const p=s.split("-").map(Number); return new Date(p[0],p[1]-1,p[2]); };
const addDays = (s,n) => { const d=parse(s); d.setDate(d.getDate()+n); return iso(d); };
const mondayOf = s => addDays(s, -((parse(s).getDay()+6)%7));
const de = s => { const d=parse(s); return pad(d.getDate())+"."+pad(d.getMonth()+1)+"."; };
const wdde = s => WD[parse(s).getDay()]+" "+de(s);
const fmtKg = v => (Math.round(v*100)/100).toString().replace(".",",");
const fmtMin = m => m>=60 ? Math.floor(m/60)+":"+pad(m%60)+" h" : m+" min";
const clone = o => JSON.parse(JSON.stringify(o));
const $ = id => document.getElementById(id);
function weekOf(s){ const diff=Math.round((parse(s)-parse(BLOCK_START_ISO))/864e5); return diff<0?0:Math.floor(diff/7)+1; }
function el(tag, cls, text){ const n=document.createElement(tag); if(cls) n.className=cls; if(text!=null) n.textContent=text; return n; }
function btn(cls, text, onClick, label){ const b=el("button",cls,text); b.type="button"; b.onclick=onClick; if(label) b.setAttribute("aria-label",label); return b; }

function pushBase(s){ const diff=Math.round((parse(s)-parse(BLOCK_START_ISO))/864e5);
  if(diff<0) return {s:3,r:"10",note:"Einstieg: 30 am Tag"};
  if(diff<7) return {s:4,r:"10",note:"Woche 1: 40 am Tag"};
  if(diff<14) return {s:5,r:"14",note:"Woche 2: 70 am Tag"};
  return {s:5,r:"20",note:"Ab Woche 3: 100 am Tag"}; }
function pushPlan(s){ const b=pushBase(s); if(parse(s).getDay()!==2) return b;
  const sets=Math.ceil(b.s/2), tot=b.s*parseInt(b.r,10)/2;
  return {s:sets,r:String(Math.round(tot/sets)),note:b.note+", dienstags die Hälfte"}; }

/* ---------- state ---------- */
let TODAY = iso(new Date());
let viewDate = TODAY, tab = "today", unitView = null, moving = null, pendingRender = false;
const S = {plan:{}, daily:{}, answers:{}, logs:{}, targets:{kg:{}}, races:{}, course:null, ready:false, timedOut:false, offline:false};
let editRace = null, draft = null, calc = null;
const openHow = {};
let db = null;
const timers = {}, busy = {}, dirty = {};

function lsGet(k){ try{ return JSON.parse(localStorage.getItem("kona:"+k)||"null"); }catch(e){ return null; } }
function lsSet(k,v){ try{ localStorage.setItem("kona:"+k,JSON.stringify(v)); }catch(e){} }
function setSync(t){ $("sync").textContent=t; }

/* One write at a time per document, coalesced over a short pause. */
function persist(path, getBody){
  dirty[path]=true; lsSet(path,getBody());
  if(!db) return;
  clearTimeout(timers[path]);
  timers[path]=setTimeout(async()=>{
    if(busy[path]){ busy[path].again=true; return; }
    busy[path]={again:false}; let ok=false;
    try{ await db.doc(path).set(clone(getBody())); ok=true; setSync("Gespeichert."); }
    catch(e){ setSync(e&&e.code==="invalid_argument" ? "Nur auf diesem Gerät gespeichert." : "Offline, auf diesem Gerät gesichert."); }
    const again=busy[path].again; delete busy[path];
    if(again) persist(path,getBody); else if(ok) delete dirty[path];
  },600);
}
function logOf(u, date){
  const k=(date||viewDate)+"_"+u;
  if(!S.logs[k]) S.logs[k] = (!db && lsGet("log/"+k)) || {date:date||viewDate,unit:u,week:weekOf(date||viewDate),sets:{},kg:{}};
  return S.logs[k];
}
function saveLog(u){ const k=viewDate+"_"+u; persist("log/"+k, ()=>S.logs[k]); }
function getA(date){ return S.answers[date] || {date:date,sessions:{},issues:[]}; }
function mutA(date, fn){
  const A = S.answers[date] || (S.answers[date] = (!db && lsGet("answers/"+date)) || {date:date,sessions:{},issues:[]});
  if(!A.sessions) A.sessions={}; if(!A.issues) A.issues=[];
  fn(A); A.updatedAt=new Date().toISOString();
  persist("answers/"+date, ()=>S.answers[date]);
}
function goalKg(id){
  const g=S.targets.kg?S.targets.kg[id]:null; if(g==null) return null;
  const since=S.targets.since&&S.targets.since[id], last=lastKg(id);
  return (since&&last&&last.date>since) ? null : g;
}
function lastKg(id){
  let best=null;
  for(const k in S.logs){ const L=S.logs[k]; if(!L||L.date>=viewDate) continue;
    if(L.kg && L.kg[id]!=null && (!best||L.date>best.date)) best={date:L.date,kg:L.kg[id]}; }
  return best;
}

/* ---------- what counts as done ---------- */
function unitProgress(L,u){
  const ex=UNITS[u].ex.filter(e=>u!=="M"||e.id!=="push");
  return {n:ex.filter(e=>((L.sets&&L.sets[e.id])||0)>0).length, of:ex.length};
}
function logDone(date,u){ const L=S.logs[date+"_"+u]; if(!L) return null; const p=unitProgress(L,u); return p.n>=Math.ceil(p.of*0.6) ? p : null; }
function sessState(date,s){
  const a=S.answers[date]&&S.answers[date].sessions&&S.answers[date].sessions[s.id];
  if(a&&a.state==="skipped") return "skipped";
  if(a&&a.state==="done") return "done";
  if(s.kind==="kraft"&&s.unit&&logDone(date,s.unit)) return "done";
  if(s.kind==="mobility"&&logDone(date,"M")) return "done";
  const au=S.daily[date]&&S.daily[date].auto&&S.daily[date].auto[s.id];
  if(au&&au.done) return "done";
  return date<TODAY ? "missed" : "open";
}
function dayStatus(date){
  const P=S.plan[date]; if(!P) return "none";
  const ss=P.sessions||[]; if(!ss.length) return "rest";
  const st=ss.map(s=>sessState(date,s));
  if(st.every(x=>x==="done")) return "done";
  if(st.some(x=>x==="missed"||x==="skipped")) return st.some(x=>x==="done") ? "part" : "miss";
  return st.some(x=>x==="done") ? "part" : "open";
}
/* Mobility und Liegestütze zählen nicht zur Quote, nur die Einheiten aus dem Trainingsplan. */
function zaehlt(s){ return s.kind!=="mobility"; }
function quota(){
  const ws=mondayOf(TODAY), we=addDays(ws,6);
  const q={wDue:0,wDone:0,wOpen:0,wMoved:0,bDue:0,bDone:0};
  for(const date in S.plan){
    if(date<BLOCK_START_ISO) continue;
    const inWeek=date>=ws&&date<=we;
    (S.plan[date].sessions||[]).forEach(s=>{
      if(!zaehlt(s)) return;
      if(inWeek&&s.movedFrom) q.wMoved++;
      const st=sessState(date,s);
      if(date>TODAY||st==="open"){ if(inWeek) q.wOpen++; return; }
      q.bDue++; if(st==="done") q.bDone++;
      if(inWeek){ q.wDue++; if(st==="done") q.wDone++; }
    });
  }
  return q;
}

/* ---------- render ---------- */
function safeRender(){
  const a=document.activeElement;
  if(a && (a.tagName==="TEXTAREA"||a.tagName==="INPUT") && $("main").contains(a)){ pendingRender=true; return; }
  render();
}
function render(){
  pendingRender=false;
  document.querySelectorAll(".tab").forEach(t=>t.setAttribute("aria-selected", String(t.dataset.v===tab)));
  const wide = tab==="kurs"||tab==="saison";
  $("strip").hidden = wide; if(!wide) renderStrip();
  const C=S.course, dR=C&&C.raceDate?daysTo(C.raceDate):-1, nr=nextRace();
  $("t-kurs").firstElementChild.textContent = dR>=0 ? String(dR) : "→";
  $("t-kurs").lastElementChild.textContent = dR>=0 ? "Kurs bis "+(C.raceShort||"Ziel") : "Kurs";
  $("t-saison").firstElementChild.textContent = nr ? de(nr.date) : "◇";
  const main=$("main"); main.textContent="";
  if(tab==="kraft") renderKraft(main); else if(tab==="kurs") renderKurs(main); else if(tab==="saison") renderSaison(main); else renderDay(main);
}
function renderStrip(){
  const strip=$("strip"); strip.textContent="";
  const mon=mondayOf(viewDate);
  strip.append(btn("navw","‹",()=>{ viewDate=addDays(viewDate,-7); unitView=null; moving=null; render(); },"Vorherige Woche"));
  for(let i=0;i<7;i++){
    const date=addDays(mon,i), d=parse(date), st=dayStatus(date);
    const b=btn("day"+(date===viewDate?" sel":"")+(date===TODAY?" today":""),null,()=>{ viewDate=date; unitView=null; moving=null; render(); });
    b.append(el("span","dw",WD[d.getDay()]), el("span","dn",String(d.getDate())), el("i","st st-"+st));
    const stTxt={done:", alles erledigt",miss:", offen geblieben",part:", teilweise erledigt",open:"",rest:", Ruhetag",none:""}[st];
    b.setAttribute("aria-label",WDL[d.getDay()]+" "+de(date)+stTxt); b.setAttribute("aria-pressed",String(date===viewDate));
    strip.append(b);
  }
  strip.append(btn("navw","›",()=>{ viewDate=addDays(viewDate,7); unitView=null; moving=null; render(); },"Nächste Woche"));
}
function headline(){
  const w=weekOf(viewDate), P=S.plan[viewDate];
  $("eyebrow").textContent = wdde(viewDate)+(w>=1&&w<=BLOCK_WEEKS?" · Woche "+w+" von "+BLOCK_WEEKS:"")+(P&&P.kids?" · Kinderzeit":"");
}

function renderDay(main){
  headline(); $("kbar").hidden=true;
  const P=S.plan[viewDate], D=S.daily[viewDate];
  $("title").textContent = viewDate===TODAY ? "Heute" : WDL[parse(viewDate).getDay()];
  $("foot").textContent = "Deine Angaben liest der Check-in am nächsten Morgen mit.";

  if(!S.ready){
    $("sub").textContent="";
    const c=el("section","card");
    c.append(el("h2",null,S.timedOut||S.offline?"Deine Daten sind gerade nicht erreichbar":"Dein Tag wird geladen"),
      el("div","hint",S.offline?"Die Seite läuft ohne Verbindung zum Speicher. Öffne sie in Claude, während du angemeldet bist.":S.timedOut?"Die Seite versucht es weiter. Plan, Ampel und Garmin-Werte erscheinen, sobald die Verbindung steht.":"Plan, Ampel und Garmin-Werte erscheinen gleich hier."));
    main.append(c); return;
  }
  const ss=(P&&P.sessions)||[];
  $("sub").textContent = !P ? "Für diesen Tag ist kein Plan hinterlegt." : ss.length ? ss.map(s=>s.title).join(" + ") : "Ruhetag";

  if(viewDate<=TODAY) main.append(ampelCard(D));
  if(P&&P.note) main.append(el("div","notice",P.note));
  ss.forEach(s=>main.append(sessCard(s)));
  if(P&&P.movedOut&&P.movedOut.length) P.movedOut.forEach(m=>main.append(el("div","hint","Verschoben: "+m.title+" auf "+wdde(m.to))));
  if(P) main.append(pushLine());
  if(viewDate<=TODAY) main.append(feelCard());
  const g=garminCard(D); if(g) main.append(g);
  main.append(quotaCard());
}
function ampelCard(D){
  const a=D&&D.ampel, c=el("section","ampel a-"+(a||"none"));
  if(!a){
    c.append(el("div","pill","Check-in"), el("div",null, viewDate===TODAY ? "Der Check-in kommt gegen 8:30 Uhr. Danach stehen hier die Ampel und der Hinweis für den Tag." : "Für diesen Tag gibt es keine Ampel."));
    return c;
  }
  c.append(el("div","pill",AMPEL[a]+(D.ampelFinal?"":" · vorläufig")));
  if(D.coach) c.append(el("div",null,D.coach));
  return c;
}
function sessCard(s){
  const date=viewDate, st=sessState(date,s), A=getA(date), a=(A.sessions&&A.sessions[s.id])||{};
  const c=el("article","card sess "+st);
  const head=el("div","shead"); head.append(el("span","kind",KIND[s.kind]||"Einheit"));
  if(s.key) head.append(el("span","tag key","Schlüsseleinheit"));
  if(s.movedFrom) head.append(el("span","tag","von "+wdde(s.movedFrom)));
  if(s.min) head.append(el("span","smin",fmtMin(s.min)));
  c.append(head, el("div","stitle",s.title));
  if(s.detail) c.append(el("div","sdetail",s.detail));
  const au=S.daily[date]&&S.daily[date].auto&&S.daily[date].auto[s.id];
  if(au&&au.text) c.append(el("div","sauto",au.text));
  const isLog=s.kind==="kraft"||s.kind==="mobility", unit=s.kind==="kraft"?s.unit:"M";
  const lp=isLog?logDone(date,unit):null;
  const openUnit=()=>{ tab="kraft"; unitView=unit; render(); window.scrollTo(0,0); };

  if(st==="done"){
    c.append(el("div","sstate","✓ Erledigt"+(lp?" · laut Logbuch "+lp.n+" von "+lp.of+" Übungen":"")));
    c.append(el("div","lbl","Wie hart war es? RPE 1 bis 10"));
    const chips=el("div","chips");
    for(let n=1;n<=10;n++){ const b=btn("chip num"+(a.rpe===n?" on":""),String(n),()=>{ mutA(date,A=>{ A.sessions[s.id]=Object.assign({},A.sessions[s.id],{state:"done",rpe:n}); }); render(); },"RPE "+n);
      b.setAttribute("aria-pressed",String(a.rpe===n)); chips.append(b); }
    c.append(chips);
    const acts=el("div","acts");
    if(isLog) acts.append(btn("act",s.kind==="kraft"?"Einheit öffnen":"Routine öffnen",openUnit));
    if(a.state==="done") acts.append(btn("act quiet","Zurücksetzen",()=>{ mutA(date,A=>{ delete A.sessions[s.id]; }); render(); }));
    if(acts.children.length) c.append(acts);
    return c;
  }
  if(st==="skipped"){
    c.append(el("div","sstate","Ausgefallen"));
    const acts=el("div","acts"); acts.append(btn("act quiet","Zurücksetzen",()=>{ mutA(date,A=>{ delete A.sessions[s.id]; }); render(); })); c.append(acts);
    return c;
  }
  if(st==="missed") c.append(el("div","sstate","Nicht eingetragen"));
  const acts=el("div","acts");
  if(isLog) acts.append(btn("act pri",s.kind==="kraft"?"Einheit öffnen":"Routine öffnen",openUnit));
  if(date<=TODAY) acts.append(btn("act"+(isLog?"":" pri"),"Erledigt",()=>{ mutA(date,A=>{ A.sessions[s.id]=Object.assign({},A.sessions[s.id],{state:"done"}); }); render(); }));
  if(date<=TODAY) acts.append(btn("act","Ausgefallen",()=>{ mutA(date,A=>{ A.sessions[s.id]={state:"skipped"}; }); render(); }));
  if(db) acts.append(btn("act","Verschieben",()=>{ moving=(moving===s.id?null:s.id); render(); }));
  c.append(acts);
  if(moving===s.id){
    c.append(el("div","lbl","Auf welchen Tag dieser Woche?"));
    const chips=el("div","chips"), mon=mondayOf(date);
    for(let i=0;i<7;i++){ const to=addDays(mon,i); if(to===date||!S.plan[to]) continue;
      chips.append(btn("chip",wdde(to),()=>moveSession(date,to,s.id))); }
    c.append(chips);
  }
  return c;
}
function moveSession(from,to,sid){
  const src=clone(S.plan[from]), dst=clone(S.plan[to]);
  const s=(src.sessions||[]).find(x=>x.id===sid); if(!s) return;
  const origin=s.movedFrom||from, m=Object.assign({},s);
  if(origin===to) delete m.movedFrom; else m.movedFrom=origin;
  if((dst.sessions||[]).some(x=>x.id===m.id)) m.id=m.id+"_"+from.slice(5).replace("-","");
  src.sessions=src.sessions.filter(x=>x.id!==sid);
  src.movedOut=(src.movedOut||[]).filter(x=>x.id!==sid).concat([{id:sid,title:s.title,to:to}]);
  dst.sessions=(dst.sessions||[]).concat([m]);
  dst.movedOut=(dst.movedOut||[]).filter(x=>!(x.id===sid&&x.to===from));
  S.plan[from]=src; S.plan[to]=dst; moving=null;
  if(S.answers[from]&&S.answers[from].sessions&&S.answers[from].sessions[sid]) mutA(from,A=>{ delete A.sessions[sid]; });
  persist("plan/"+from,()=>S.plan[from]); persist("plan/"+to,()=>S.plan[to]);
  render();
}
function pushLine(){
  const pp=pushPlan(viewDate), L=S.logs[viewDate+"_M"], done=(L&&L.sets&&L.sets.push)||0;
  const c=el("div","card"); const row=el("div","qrow");
  const t=el("div",null); t.append(el("div","lbl","Liegestütze"), el("div","stitle",pp.s+" × "+pp.r+" · "+(pp.s*parseInt(pp.r,10))+" am Tag"));
  row.append(t, el("div","qbig",done+" / "+pp.s)); c.append(row);
  const chips=el("div","chips");
  for(let k=1;k<=pp.s;k++){ const b=btn("chip num"+(k<=done?" on":""),String(k),()=>{ const LM=logOf("M"); LM.sets.push=(done===k)?k-1:k; saveLog("M"); render(); },"Satz "+k); b.setAttribute("aria-pressed",String(k<=done)); chips.append(b); }
  c.append(chips, el("div","hint",pp.note+". Sätze dürfen über den Tag verteilt sein."));
  return c;
}
function feelCard(){
  const date=viewDate, A=getA(date), c=el("section","card");
  c.append(el("h2",null,date===TODAY?"Wie geht es dir heute?":"Wie ging es dir?"));
  const f=el("div","chips");
  FEEL.forEach(([v,t])=>{ const b=btn("chip"+(A.feel===v?" on":""),t,()=>{ mutA(date,A=>{ A.feel=(A.feel===v?null:v); }); render(); }); b.setAttribute("aria-pressed",String(A.feel===v)); f.append(b); });
  c.append(f, el("div","lbl","Beschwerden"));
  const is=el("div","chips"), cur=A.issues||[];
  ISSUES.forEach(([v,t])=>{ const on=cur.includes(v);
    const b=btn("chip"+(on?" on":""),t,()=>{ mutA(date,A=>{
      if(v==="none") A.issues = on ? [] : ["none"];
      else { A.issues=A.issues.filter(x=>x!=="none"&&x!==v); if(!on) A.issues.push(v); } }); render(); });
    b.setAttribute("aria-pressed",String(on)); is.append(b); });
  c.append(is);
  const ta=el("textarea"); ta.id="note-"+date; ta.placeholder="Notiz für den Coach, zum Beispiel was zwickt oder was gut lief"; ta.value=A.note||""; ta.setAttribute("aria-label","Notiz für den Coach");
  ta.oninput=()=>{ mutA(date,A=>{ A.note=ta.value; }); };
  ta.onblur=()=>{ if(pendingRender) render(); };
  c.append(ta);
  return c;
}
function spark(vals, band){
  const nums=vals.filter(v=>v!=null); if(nums.length<2) return null;
  const W=120,H=34,p=4, NS="http://www.w3.org/2000/svg";
  let lo=Math.min.apply(null,nums.concat(band?[band[0]]:[])), hi=Math.max.apply(null,nums.concat(band?[band[1]]:[]));
  if(hi===lo){ hi+=1; lo-=1; }
  const x=i=>p+i*(W-2*p)/(vals.length-1), y=v=>H-p-(v-lo)*(H-2*p)/(hi-lo);
  const svg=document.createElementNS(NS,"svg"); svg.setAttribute("viewBox","0 0 "+W+" "+H); svg.setAttribute("class","spark"); svg.setAttribute("aria-hidden","true");
  if(band){ const r=document.createElementNS(NS,"rect"); r.setAttribute("class","band"); r.setAttribute("x",0); r.setAttribute("width",W); r.setAttribute("y",y(band[1])); r.setAttribute("height",Math.max(1,y(band[0])-y(band[1]))); svg.append(r); }
  let seg=[]; const flush=()=>{ if(seg.length>1){ const pl=document.createElementNS(NS,"polyline"); pl.setAttribute("class","ln"); pl.setAttribute("points",seg.join(" ")); svg.append(pl); } seg=[]; };
  vals.forEach((v,i)=>{ if(v==null) flush(); else seg.push(x(i).toFixed(1)+","+y(v).toFixed(1)); }); flush();
  let li=vals.length-1; while(li>=0&&vals[li]==null) li--;
  const c=document.createElementNS(NS,"circle"); c.setAttribute("class","pt"); c.setAttribute("cx",x(li)); c.setAttribute("cy",y(vals[li])); c.setAttribute("r",3); svg.append(c);
  return svg;
}
function garminCard(D){
  const g=(d)=>S.daily[d]&&S.daily[d].garmin||null, cur=g(viewDate);
  const series=k=>{ const a=[]; for(let i=13;i>=0;i--){ const x=g(addDays(viewDate,-i)); a.push(x&&x[k]!=null?x[k]:null); } return a; };
  const avg7=k=>{ const a=[]; for(let i=1;i<=7;i++){ const x=g(addDays(viewDate,-i)); if(x&&x[k]!=null) a.push(x[k]); } return a.length>=3 ? a.reduce((p,c)=>p+c,0)/a.length : null; };
  if(!cur && series("rhr").filter(v=>v!=null).length<2) return null;
  const c=el("section","card"); c.append(el("h2",null,viewDate===TODAY?"Garmin heute früh":"Garmin am Morgen"));
  if(!cur) c.append(el("div","hint","Für diesen Morgen liegen noch keine Werte vor. Die Kurven zeigen die 14 Tage davor."));
  const tiles=el("div","tiles");
  const tile=(label,val,unit,k,band,avgTxt)=>{ const t=el("div","tile"); t.append(el("div","lbl",label));
    const v=el("div","v",val!=null?String(val):"–"); if(unit&&val!=null) v.append(el("small",null,unit)); t.append(v);
    const sp=spark(series(k),band); if(sp) t.append(sp);
    if(avgTxt) t.append(el("div","d",avgTxt)); return t; };
  const a1=avg7("rhr"), a2=avg7("hrv"), a3=avg7("sleepMin");
  tiles.append(
    tile("Ruhepuls",cur?cur.rhr:null,"",  "rhr",[48,51], a1!=null?"Ø 7 Tage "+Math.round(a1):""),
    tile("HRV Nacht",cur?cur.hrv:null,"ms","hrv",[43,52], a2!=null?"Ø 7 Tage "+Math.round(a2):""),
    tile("Schlaf",cur&&cur.sleepMin!=null?Math.floor(cur.sleepMin/60)+":"+pad(cur.sleepMin%60):null,"h","sleepMin",null, cur&&cur.sleepScore!=null?"Score "+cur.sleepScore:"")
  );
  c.append(tiles, el("div","hint","Grün hinterlegt ist dein Normalbereich: Ruhepuls 48 bis 51, HRV 43 bis 52. Die Kurven zeigen 14 Tage."+(cur&&cur.bb!=null?" Body Battery über Nacht +"+cur.bb+".":"")));
  return c;
}
function quotaCard(){
  const q=quota(), w=weekOf(TODAY), c=el("section","card");
  c.append(el("h2",null,"Dein 90-Prozent-Ziel"));
  if(!q.bDue){ c.append(el("div","hint","Sobald die ersten Einheiten fällig waren, steht hier deine Quote für Woche und Block.")); return c; }
  const pct=Math.round(q.bDone/q.bDue*100);
  const r1=el("div","qrow"); const l1=el("div",null); l1.append(el("div","lbl","Woche "+w), el("div",null,q.wDone+" von "+q.wDue+" fälligen Einheiten erledigt"+(q.wOpen?", "+q.wOpen+" stehen noch an":"")));
  r1.append(l1, el("div","qbig",q.wDue?Math.round(q.wDone/q.wDue*100)+" %":"–")); c.append(r1);
  const r2=el("div","qrow"); const l2=el("div",null); l2.append(el("div","lbl","Block"), el("div",null,q.bDone+" von "+q.bDue+" erledigt"));
  r2.append(l2, el("div","qbig",pct+" %")); c.append(r2);
  const bar=el("div","qbar"+(pct<90?" low":"")); const i=el("i"); i.style.width=pct+"%"; bar.append(i, el("b")); bar.setAttribute("role","img"); bar.setAttribute("aria-label","Block-Quote "+pct+" Prozent, Ziel 90 Prozent");
  const sc=el("div","qscale"); sc.append(el("span",null,"0 %"), el("span",null,"Ziel 90 %"));
  c.append(bar, sc);
  if(q.wMoved>2) c.append(el("div","notice","Diese Woche sind schon "+q.wMoved+" Einheiten verschoben. Ab der dritten schaut der Coach genauer hin."));
  return c;
}

/* ---------- course and season ---------- */
const RKIND = {run:"Lauf", bike:"Rad", tri:"Triathlon", swim:"Schwimmen", trail:"Trail"};
const ROLES = [["A","A-Rennen"],["B","B-Rennen"],["Test","Test"],["Verein","Verein"]];
const RSTAT = [["geplant","geplant"],["offen","noch offen"],["absolviert","absolviert"],["gestrichen","gestrichen"]];
const fmtH = m => { m=Math.round(m); return Math.floor(m/60)+":"+pad(m%60); };
const rng = a => a[0]===a[1] ? fmtH(a[0]) : fmtH(a[0])+" bis "+fmtH(a[1]);
const mins = n => n===1 ? "1 Minute" : n+" Minuten";
const daysTo = s => Math.round((parse(s)-parse(TODAY))/864e5);
const inDays = n => n===0 ? "heute" : n===1 ? "morgen" : n>0 ? "in "+n+" Tagen" : n===-1 ? "gestern" : "vor "+(-n)+" Tagen";
const dlong = r => r.dateText || (wdde(r.date)+parse(r.date).getFullYear());
function racesSorted(){ return Object.keys(S.races).map(k=>Object.assign({id:k},S.races[k])).filter(r=>r.date&&r.name).sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:0); }
function nextRace(){ return racesSorted().find(r=>r.date>=TODAY&&r.status!=="gestrichen"&&r.status!=="absolviert")||null; }
function weekStats(){
  const out=[], cw=Math.min(weekOf(TODAY),BLOCK_WEEKS);
  for(let w=1;w<=cw;w++){
    const mon=addDays(BLOCK_START_ISO,(w-1)*7), st={w:w,due:0,done:0,moved:0,keyMiss:0,minPlan:0,minDone:0,complete:addDays(mon,6)<TODAY};
    for(let i=0;i<7;i++){ const d=addDays(mon,i), P=S.plan[d]; if(!P) continue;
      (P.sessions||[]).forEach(s=>{ if(!zaehlt(s)) return; if(s.movedFrom) st.moved++;
        const x=sessState(d,s); if(d>TODAY||x==="open") return;
        st.due++; st.minPlan+=s.min||0;
        if(x==="done"){ st.done++; st.minDone+=s.min||0; } else if(s.key) st.keyMiss++; }); }
    out.push(st);
  }
  return out;
}

function renderKurs(main){
  $("kbar").hidden=true;
  const C=S.course;
  $("eyebrow").textContent="Kona 2029"; $("title").textContent="Kurs";
  $("foot").textContent="Die Schätzung pflegt der Coach und zieht sie nach jedem Test nach.";
  if(!C||!C.disc){
    $("sub").textContent="";
    const c=el("section","card");
    c.append(el("h2",null,S.ready?"Noch kein Kurs hinterlegt":"Dein Kurs wird geladen"), el("div","hint","Hier stehen dein Stand, die Ziele für das nächste A-Rennen und der Abstand zur Kona-Quali."));
    main.append(c); return;
  }
  $("sub").textContent="Wo du stehst und was bis "+C.raceShort+" und Kona fehlt.";
  main.append(countCard(C), totalCard(C));
  ["swim","bike","run"].forEach(k=>{ if(C.disc[k]) main.append(discCard(C.disc[k],C)); });
  const n=nextCard(); if(n) main.append(n);
  main.append(rulesCard(), calcCard(C));
}
function countCard(C){
  const c=el("section","card"), d=daysTo(C.raceDate);
  c.append(el("div","lbl",C.raceName+" · "+wdde(C.raceDate)+parse(C.raceDate).getFullYear()));
  const cd=el("div","cd");
  if(d>=0){ cd.append(el("span","n",String(d)), el("span","stitle",d===1?"Tag":"Tage")); if(d>13) cd.append(el("span","hint",Math.floor(d/7)+" Wochen und "+(d%7===1?"1 Tag":(d%7)+" Tage"))); }
  else cd.append(el("span","stitle","Das Rennen ist vorbei. Zeit für das nächste Ziel."));
  c.append(cd);
  const t0=parse(BLOCK_START_ISO), span=parse(C.konaDate)-t0;
  const pos=s=>Math.max(0,Math.min(100,(parse(s)-t0)/span*100));
  const road=el("div","road"), go=el("i","go"); go.style.width=pos(TODAY)+"%"; road.append(el("i","ln"),go);
  const marks=racesSorted().filter(r=>r.mile&&r.status!=="gestrichen"); let nextSet=false;
  marks.forEach(r=>{ const p=pos(r.date), m=el("i","mk"), dd=parse(r.date); m.style.left=p+"%";
    if(!nextSet&&r.date>=TODAY){ m.classList.add("next"); nextSet=true; }
    const lb=el("span","lb t"+(p>88?" r":p<8?" l":""),(r.short||r.name)+" "+pad(dd.getMonth()+1)+"/"+String(dd.getFullYear()).slice(2));
    lb.style.left=p+"%"; road.append(m,lb); });
  const now=el("i","mk now"), nl=el("span","lb b l","Heute"); now.style.left=pos(TODAY)+"%"; nl.style.left=pos(TODAY)+"%"; road.append(now,nl);
  road.setAttribute("role","img"); road.setAttribute("aria-label","Zeitstrahl von heute bis Kona "+parse(C.konaDate).getFullYear()+(marks.length?" mit "+marks.map(r=>r.short||r.name).join(", "):""));
  c.append(road);
  return c;
}
function estTotal(C,k){ return ["swim","bike","run"].reduce((a,x)=>a+(C.disc[x]?C.disc[x].est[k]:0),0)+((C.trans&&C.trans.est)||0); }
function totalCard(C){
  const c=el("section","card"); c.append(el("h2",null,"Gesamtzeit Langdistanz"));
  const w=estTotal(C,"w"), tiles=el("div","tiles");
  const tile=(label,v,d)=>{ const t=el("div","tile"); t.append(el("div","lbl",label), el("div","v",v)); if(d) t.append(el("div","d",d)); return t; };
  tiles.append(tile("Stand etwa",fmtH(w),fmtH(estTotal(C,"a"))+" bis "+fmtH(estTotal(C,"k"))),
    tile("Ziel "+C.raceShort,fmtH(C.goal.race),wdde(C.raceDate)+parse(C.raceDate).getFullYear()),
    tile("Kona-Quali",fmtH(C.goal.kona[0]),"bis "+fmtH(C.goal.kona[1])));
  c.append(tiles);
  const gap=Math.round(w-C.goal.race);
  c.append(el("div",null, gap>0 ? "Bis zum Ziel für "+C.raceShort+" fehlen nach heutigem Stand etwa "+mins(gap)+"." : "Nach heutigem Stand liegst du im Ziel für "+C.raceShort+"."));
  if(C.base) c.append(el("div","hint",C.base));
  if(C.note) c.append(el("div","hint",C.note));
  return c;
}
function discCard(D,C){
  const c=el("section","card"), e=D.est, rs=C.raceShort;
  const head=el("div","dhead"); head.append(el("div","lbl",D.label+" · "+D.dist), el("div","dval","≈ "+fmtH(e.w))); c.append(head);
  const slow=Math.max(D.base,e.k), fast=Math.min(D.kona[0],D.race[0]), span=Math.max(1,slow-fast);
  const hi=slow+span*0.04, lo=fast-span*0.08, x=v=>(hi-v)/(hi-lo)*100;
  const g=el("div","gauge"); g.append(el("i","tr"));
  const band=el("i","band"); band.style.left=x(e.k)+"%"; band.style.width=Math.max(1,x(e.a)-x(e.k))+"%"; g.append(band);
  const bt=el("i","base"); bt.style.left=x(D.base)+"%"; g.append(bt);
  const zone=(cls,a)=>{ const z=el("i","zone "+cls); z.style.left=x(a[1])+"%"; z.style.width=Math.max(0,x(a[0])-x(a[1]))+"%"; g.append(z); };
  const lab=(t,a,b)=>{ const mid=(x(a)+x(b))/2, right=mid>84, s=el("span","tl"+(right?" r":""),t); s.style.left=(right?Math.min(100,x(b)+2):mid)+"%"; g.append(s); };
  zone("kona",D.kona); zone("race",D.race);
  if(D.race[0]<=D.kona[1]) lab(rs+" und Kona",Math.max(D.race[1],D.kona[1]),Math.min(D.race[0],D.kona[0]));
  else { lab(rs,D.race[1],D.race[0]); lab("Kona",D.kona[1],D.kona[0]); }
  const dot=el("i","dotp"); dot.style.left=x(e.w)+"%"; g.append(dot);
  g.setAttribute("role","img"); g.setAttribute("aria-label",D.label+": Stand etwa "+fmtH(e.w)+", Ziel "+rs+" "+rng(D.race)+", Kona "+rng(D.kona));
  c.append(g);
  const dl=el("div","dl"), item=(k,v)=>{ const s=el("span",null,k+" "); s.append(el("b",null,v)); dl.append(s); };
  item(D.baseLabel||"Zuletzt",fmtH(D.base)); item("Stand",fmtH(e.a)+" bis "+fmtH(e.k)); item("Ziel "+rs,rng(D.race)); item("Kona",rng(D.kona));
  c.append(dl);
  const gap=Math.round(e.w-D.race[1]);
  c.append(el("div",null, gap>0 ? "Noch etwa "+mins(gap)+" bis zum Ziel für "+rs+"." : "Das Ziel für "+rs+" ist nach heutigem Stand erreicht."));
  if(D.need) c.append(el("div","hint",D.need));
  return c;
}
function nextCard(){
  const r=racesSorted().find(x=>x.date>=TODAY&&x.status!=="gestrichen"&&x.status!=="absolviert"&&x.role!=="Verein"); if(!r) return null;
  const c=el("section","card"), d=daysTo(r.date); c.append(el("div","lbl","Nächster Messpunkt"));
  const row=el("div","qrow"), l=el("div",null); l.append(el("div","stitle",r.name), el("div","hint",dlong(r)+(r.dist?" · "+r.dist:"")));
  row.append(l, el("div","qbig",d<=0?"heute":d===1?"1 Tag":d+" Tage")); c.append(row);
  if(r.goal) c.append(el("div",null,"Ziel: "+r.goal));
  if(r.expect) c.append(el("div","hint",r.expect));
  const acts=el("div","acts"); acts.append(btn("act","Alle Termine ansehen",()=>{ tab="saison"; render(); window.scrollTo(0,0); })); c.append(acts);
  return c;
}
function rulesCard(){
  const c=el("section","card"); c.append(el("h2",null,"Kurs halten"));
  const ws=weekStats(), q=quota(), last2=ws.filter(w=>w.complete).slice(-2), cur=ws[ws.length-1];
  const pct=q.bDue?Math.round(q.bDone/q.bDue*100):null, moved=cur?cur.moved:0;
  const two=f=>last2.length===2&&last2.every(f);
  const keyMiss=ws.reduce((a,w)=>a+w.keyMiss,0);
  const rules=[
    ["Quote", pct==null?"Noch keine Einheit fällig.":"Block "+pct+" % bei "+q.bDue+" fälligen Einheiten, Ziel 90 %."+(q.bDue<10?" Bewertet wird ab 10 Einheiten.":""), (q.bDue>=10&&pct<90)||two(w=>w.due>0&&w.done/w.due<0.9)],
    ["Verschieben", (moved===0?"Keine Einheit":moved===1?"1 Einheit":moved+" Einheiten")+" in dieser Woche verschoben. Mehr als 2 sind zu viel.", moved>2],
    ["Schlüsseleinheiten", (keyMiss===0?"Keine Einheit":keyMiss===1?"1 Einheit":keyMiss+" Einheiten")+" im Block ausgefallen. Ab der zweiten wird es kritisch.", keyMiss>=2],
    ["Umfang", last2.length<2?"Wird ab zwei vollen Wochen bewertet.":"Erledigt in den letzten zwei Wochen: "+last2.map(w=>w.minPlan?Math.round(w.minDone/w.minPlan*100)+" %":"ohne Plan").join(" und ")+" der geplanten Minuten.", two(w=>w.minPlan>0&&w.minDone/w.minPlan<0.8)]
  ];
  rules.forEach(([t,d,hit])=>{ const r=el("div","rule"), l=el("div",null); l.append(el("div","name",t), el("div","hint",d)); r.append(l, el("span","rchip"+(hit?" hit":""),hit?"ausgelöst":"im Rahmen")); c.append(r); });
  c.append(el("div","hint","Löst eine Regel aus, meldet sich der Coach mit einem konkreten Vorschlag."));
  return c;
}
function calcCard(C){
  const c=el("section","card"); c.append(el("h2",null,"Zielzeit durchrechnen"));
  const T=(C.trans&&C.trans.race)||8, KEYS=[["swim","Schwimmen"],["bike","Rad"],["run","Laufen"]].filter(k=>C.disc[k[0]]);
  const mid=a=>Math.round((a[0]+a[1])/2);
  const preset=f=>{ const o={}; KEYS.forEach(([k])=>{ o[k]=f(C.disc[k]); }); return o; };
  if(!calc){ const saved=lsGet("calc"); calc=(saved&&KEYS.every(([k])=>typeof saved[k]==="number")) ? saved : preset(D=>mid(D.race)); }
  const out=el("div","qbig"), l1=el("div",null), l2=el("div","hint");
  const upd=()=>{ const tot=KEYS.reduce((a,k)=>a+calc[k[0]],0)+T, g=tot-C.goal.race; out.textContent=fmtH(tot);
    l1.textContent = g===0 ? "Genau das Ziel für "+C.raceShort+" ("+fmtH(C.goal.race)+")." : mins(Math.abs(g))+(g<0?" unter":" über")+" dem Ziel für "+C.raceShort+" ("+fmtH(C.goal.race)+").";
    l2.textContent = tot<=C.goal.kona[1] ? "Das liegt im Bereich der Kona-Quali ("+rng(C.goal.kona)+")." : "Zur Kona-Quali ("+rng(C.goal.kona)+") fehlen dann noch "+mins(tot-C.goal.kona[1])+"."; };
  const row=el("div","qrow"); row.append(el("div","lbl","Gesamtzeit mit "+T+" min Wechsel"), out); c.append(row,l1,l2);
  KEYS.forEach(([k,label])=>{
    const D=C.disc[k], lo=Math.min(D.kona[0],D.race[0])-10, hi=Math.max(D.base,D.est.k)+5;
    calc[k]=Math.max(lo,Math.min(hi,calc[k]));
    const w=el("label","sl"), top=el("div","qrow"), val=el("b","slv",fmtH(calc[k]));
    top.append(el("span","lbl",label), val);
    const r=el("input"); r.type="range"; r.id="calc-"+k; r.min=lo; r.max=hi; r.step=1; r.value=calc[k];
    r.oninput=()=>{ calc[k]=+r.value; val.textContent=fmtH(calc[k]); upd(); lsSet("calc",calc); };
    r.onblur=()=>{ if(pendingRender) render(); };
    w.append(top,r); c.append(w);
  });
  const acts=el("div","acts"), go=o=>{ calc=o; lsSet("calc",calc); render(); };
  acts.append(btn("act","Ziel "+C.raceShort,()=>go(preset(D=>mid(D.race)))), btn("act","Stand heute",()=>go(preset(D=>D.est.w))), btn("act","Kona-Quali",()=>go(preset(D=>mid(D.kona)))));
  c.append(acts, el("div","hint","Links schneller, rechts langsamer. Die Regler ändern nichts am Plan."));
  upd(); return c;
}

function renderSaison(main){
  $("kbar").hidden=true; $("eyebrow").textContent="Rennen und Tests"; $("title").textContent="Saison";
  $("foot").textContent="Ziele und Ergebnisse, die du hier einträgst, lesen Coach und Check-in mit.";
  const all=racesSorted(), up=all.filter(r=>r.date>=TODAY), past=all.filter(r=>r.date<TODAY).reverse(), live=up.filter(r=>r.status!=="gestrichen");
  $("sub").textContent = live.length ? live.length+" Termine vor dir, der nächste "+inDays(daysTo(live[0].date))+"." : "";
  if(!all.length && editRace!=="new"){
    const c=el("section","card");
    c.append(el("h2",null,S.ready?"Noch keine Termine":"Deine Termine werden geladen"), el("div","hint","Hier stehen alle Rennen und Tests mit Ziel und Ergebnis, der nächste zuerst."));
    main.append(c);
  }
  if(editRace==="new") main.append(raceForm(null));
  else if(db) main.append(btn("act","Rennen oder Test hinzufügen",()=>{ editRace="new"; draft={date:"",name:"",kind:"run",role:"B",dist:"",goal:"",status:"geplant",result:"",note:""}; render(); }));
  let year=null;
  up.forEach(r=>{ const y=r.date.slice(0,4); if(y!==year){ year=y; main.append(el("h2","yr",y)); } main.append(editRace===r.id?raceForm(r):raceCard(r)); });
  if(past.length){ main.append(el("h2","yr","Vergangen")); past.forEach(r=>main.append(editRace===r.id?raceForm(r):raceCard(r))); }
}
function raceCard(r){
  const past=r.date<TODAY, c=el("article","card race"+(r.role==="A"?" arace":"")+(r.status==="gestrichen"?" off":"")+(r.status==="absolviert"?" done":""));
  const head=el("div","shead"); head.append(el("span","kind",RKIND[r.kind]||"Termin"));
  const role=ROLES.find(x=>x[0]===r.role); if(role) head.append(el("span","tag"+(r.role==="A"?" key":""),role[1]));
  head.append(el("span","rdate",dlong(r)));
  c.append(head, el("div","stitle",r.name));
  if(r.dist) c.append(el("div","sdetail",r.dist));
  if(r.status==="gestrichen") c.append(el("div","sstate","Gestrichen"));
  else if(r.status==="absolviert"||r.result) c.append(el("div","sstate","✓ "+(r.result||"Absolviert")));
  else if(!past) c.append(el("div","sauto",inDays(daysTo(r.date))+(r.status==="offen"?" · noch offen":"")));
  if(r.goal) c.append(el("div",null,"Ziel: "+r.goal));
  if(r.expect&&!r.result) c.append(el("div","hint",r.expect));
  if(r.note) c.append(el("div","hint",r.note));
  if(db){ const need=past&&!r.result&&r.status!=="gestrichen", acts=el("div","acts");
    acts.append(btn("act"+(need?" pri":""),need?"Ergebnis eintragen":"Bearbeiten",()=>{ editRace=r.id; draft=clone(r); render(); })); c.append(acts); }
  return c;
}
function raceForm(r){
  const isNew=!r, D=draft, key=isNew?"new":r.id, c=el("section","card");
  c.append(el("h2",null,isNew?"Neuer Termin":r.name));
  const field=(label,k,type,ph)=>{ const w=el("label","fld"); w.append(el("span","lbl",label));
    const i=el("input","inp"); i.type=type||"text"; i.id="race-"+k+"-"+key; i.value=D[k]||""; if(ph) i.placeholder=ph;
    i.oninput=()=>{ D[k]=i.value; }; w.append(i); c.append(w); };
  const pick=(label,k,opts)=>{ c.append(el("div","lbl",label)); const ch=el("div","chips");
    opts.forEach(([v,t])=>{ const b=btn("chip"+(D[k]===v?" on":""),t,()=>{ D[k]=v; render(); }); b.setAttribute("aria-pressed",String(D[k]===v)); ch.append(b); }); c.append(ch); };
  if(isNew){ field("Datum","date","date"); field("Name","name","text","zum Beispiel Citylauf Dresden");
    pick("Art","kind",Object.keys(RKIND).map(k=>[k,RKIND[k]])); pick("Rolle","role",ROLES); field("Distanz","dist","text","zum Beispiel 10 km"); }
  field("Ziel","goal","text","zum Beispiel unter 40 min");
  if(!isNew) field("Ergebnis","result","text","zum Beispiel 39:48");
  pick("Status","status",RSTAT);
  const ta=el("textarea"); ta.id="race-note-"+key; ta.placeholder="Notiz, zum Beispiel wie es lief"; ta.value=D.note||""; ta.setAttribute("aria-label","Notiz"); ta.oninput=()=>{ D.note=ta.value; }; c.append(ta);
  const msg=el("div","hint"), acts=el("div","acts");
  acts.append(btn("act pri","Speichern",()=>{
    if(isNew){
      if(!D.date||!(D.name||"").trim()){ msg.textContent="Datum und Name fehlen noch."; return; }
      D.name=D.name.trim(); D.id=D.date+"-"+(D.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,40)||"termin");
    }
    if(D.result&&D.status==="geplant") D.status="absolviert";
    D.updatedAt=new Date().toISOString();
    const id=D.id; S.races[id]=D; persist("races/"+id,()=>S.races[id]);
    editRace=null; draft=null; render(); window.scrollTo(0,0);
  }), btn("act","Abbrechen",()=>{ editRace=null; draft=null; render(); }));
  c.append(msg,acts);
  return c;
}

function renderKraft(main){
  headline(); $("kbar").hidden=false;
  const P=S.plan[viewDate], ss=(P&&P.sessions)||[];
  const planned=ss.filter(s=>s.kind==="kraft").map(s=>s.unit);
  const u = unitView || planned[0] || "M";
  const U=UNITS[u], L=logOf(u);
  if(u==="M"){ const pp=pushPlan(viewDate), pe=U.ex.find(x=>x.id==="push"); pe.s=pp.s; pe.r=pp.r; pe.h=pp.note+". Sätze dürfen über den Tag verteilt sein."; }
  const title=$("title"); title.textContent=""; title.append(el("span","u",u), " · "+U.name);
  $("sub").textContent = "ca. "+U.min+" min · "+U.ex.length+" Übungen · Reihenfolge von oben nach unten";
  $("foot").textContent = "Häkchen setzt alle Sätze, die Kästchen einzelne. Das Gewicht wird beim Abhaken mitgespeichert. Übungen mit Physio-Markierung nur in Absprache steigern.";

  const seg=el("div","seg");
  ["A","B","C","M"].forEach(x=>{ const b=btn("segb",null,()=>{ unitView=x; render(); window.scrollTo(0,0); }); b.append(el("b",null,x), el("span",null,UNITS[x].short+(planned.includes(x)?" · geplant":""))); b.setAttribute("aria-pressed",String(x===u)); seg.append(b); });
  main.append(seg);
  if(viewDate!==TODAY) main.append(el("div","notice","Du trägst für "+wdde(viewDate)+" ein, nicht für heute."));
  const plannedS=ss.find(s=>s.kind==="kraft"&&s.unit===u);
  if(plannedS&&plannedS.detail) main.append(el("div","notice",plannedS.detail));

  let done=0;
  U.ex.forEach((e,i)=>{
    const tgt=e.s, cur=Math.min(L.sets[e.id]||0,tgt), isDone=cur>=tgt; if(isDone) done++;
    const goal=e.kg!==null?goalKg(e.id):null, last=e.kg!==null?lastKg(e.id):null;
    const val = e.kg===null ? null : (L.kg[e.id]!=null ? L.kg[e.id] : (goal!=null ? goal : (last ? last.kg : e.kg)));
    const keepKg=()=>{ if(e.kg!==null && L.kg[e.id]==null) L.kg[e.id]=val; };
    const card=el("article","ex"+(isDone?" done":""));
    const chk=btn("chk","✓",()=>{ L.sets[e.id]= isDone?0:tgt; if(!isDone) keepKg(); saveLog(u); render(); },(isDone?"Erledigt: ":"Abhaken: ")+e.n);
    chk.setAttribute("aria-pressed",String(isDone));
    const body=el("div","body"), top=el("div","top"), nm=el("div","name");
    nm.append(el("span","ord",pad(i+1)), e.n);
    top.append(nm, el("div","dose",tgt+" × "+e.r.split(" / ")[0]));
    const meta=el("div","meta");
    if(e.phys) meta.append(el("span","tag","Physio"));
    meta.append(el("span","hint",(e.r.includes("/ Seite")?"pro Seite. ":"")+e.h));
    const row=el("div","row"), dots=el("div","dots");
    for(let k=1;k<=tgt;k++){ const d=btn("dot"+(k<=cur?" on":""),String(k),()=>{ L.sets[e.id]=(cur===k)?k-1:k; if(L.sets[e.id]>0) keepKg(); saveLog(u); render(); },"Satz "+k+(k<=cur?" erledigt":"")); dots.append(d); }
    row.append(dots);
    if(e.kg===null) row.append(el("span","kgtxt",e.txt));
    else{
      const kg=el("div","kg");
      const inp=el("input"); inp.type="number"; inp.inputMode="decimal"; inp.step=e.step; inp.min=0; inp.value=val; inp.id="kg-"+u+"-"+e.id; inp.setAttribute("aria-label","Gewicht in kg für "+e.n);
      const set=v=>{ v=Math.max(0,Math.round(v*100)/100); L.kg[e.id]=v; inp.value=v; saveLog(u); };
      const minus=btn("kgbtn","−",()=>set((+inp.value||0)-e.step),"Weniger Gewicht"), plus=btn("kgbtn","+",()=>set((+inp.value||0)+e.step),"Mehr Gewicht");
      inp.onchange=()=>set(+String(inp.value).replace(",",".")||0);
      inp.onblur=()=>{ if(pendingRender) render(); };
      if(e.per) kg.append(el("span","kgtxt",e.per));
      kg.append(minus,inp,plus,el("span","kgtxt",e.assist?"kg Hilfe":"kg"));
      row.append(kg);
    }
    const det=el("details","how"); det.append(el("summary",null,"Ausführung"));
    const ol=el("ol"); (e.how||[]).forEach(t=>ol.append(el("li",null,t))); det.append(ol);
    const a=el("a","vid", e.phys ? "Videos auf YouTube (für Physio-Übungen gilt das Video in deiner Physio-App)" : "Videos auf YouTube ansehen");
    a.href="https://www.youtube.com/results?search_query="+encodeURIComponent(e.q||e.n); a.target="_blank"; a.rel="noopener"; det.append(a);
    if(openHow[e.id]) det.open=true; det.addEventListener("toggle",()=>{ openHow[e.id]=det.open; });
    body.append(top,meta,row,det);
    if(e.kg!==null && (last || goal!=null)){
      const l=el("div","last");
      if(goal!=null && L.kg[e.id]==null) l.append(el("b",null,"Ziel heute "+fmtKg(goal)+" kg"), last?" · ":"");
      if(last) l.append("zuletzt "+de(last.date)+" "+fmtKg(last.kg)+" kg");
      body.append(l);
    }
    card.append(chk,body); main.append(card);
  });
  const bar=$("bar"); bar.querySelector("i").style.width=(done/U.ex.length*100)+"%"; bar.classList.toggle("full",done===U.ex.length);
  $("progtxt").textContent = done===U.ex.length ? "Einheit komplett" : done+" von "+U.ex.length+" Übungen";
  main.append(btn("act","Zurück zum Tag",()=>{ tab="today"; render(); window.scrollTo(0,0); }));
}

document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{ tab=t.dataset.v; moving=null; render(); window.scrollTo(0,0); });
document.addEventListener("visibilitychange",()=>{ if(document.hidden) return; const n=iso(new Date()); if(n!==TODAY){ if(viewDate===TODAY) viewDate=n; TODAY=n; render(); } });
render();

/* ---------- connect the store ---------- */
(async()=>{
  const giveUp=setTimeout(()=>{ if(!S.ready){ S.timedOut=true; safeRender(); } },10000);
  try{ db = window.claude && window.claude.use ? await window.claude.use("db") : null; }catch(e){ db=null; }
  if(!db){ clearTimeout(giveUp); S.offline=true; setSync("Keine Verbindung zum Speicher."); render(); return; }
  const fail=()=>{ setSync("Verbindung unterbrochen. Eingaben bleiben auf diesem Gerät."); };
  const take=(coll,into,after)=>snap=>{
    snap.docs.forEach(d=>{ const data=d.data(); if(!data||dirty[coll+"/"+d.id]) return; into[d.id]=clone(data); });
    if(after) after(); safeRender();
  };
  db.collection("plan").orderBy("date","desc").limit(400).onSnapshot(take("plan",S.plan,()=>{ S.ready=true; clearTimeout(giveUp); }),fail);
  db.collection("daily").orderBy("date","desc").limit(120).onSnapshot(take("daily",S.daily),fail);
  db.collection("answers").orderBy("date","desc").limit(200).onSnapshot(take("answers",S.answers),fail);
  db.collection("log").orderBy("date","desc").limit(300).onSnapshot(take("log",S.logs),fail);
  db.collection("races").orderBy("date","desc").limit(200).onSnapshot(take("races",S.races),fail);
  db.doc("meta/course").onSnapshot(d=>{ if(d.exists){ S.course=clone(d.data()); safeRender(); } },fail);
  db.doc("meta/targets").onSnapshot(d=>{ if(d.exists){ S.targets=clone(d.data()); if(!S.targets.kg) S.targets.kg={}; safeRender(); } },fail);
})();
