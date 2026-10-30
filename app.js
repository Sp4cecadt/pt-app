import { LIBRARY, seedState } from './js/data.js';
import { putVideo, getVideo, delVideo, allVideos, clearVideos } from './js/db.js';
import { syncWorkout, uploadClip, notifyTrainer, uploadLibraryVideo } from './js/backend.js';

export const APP_VERSION = 'v2';
const KEY = 'pt-app.state.v1';
const $ = (s, r = document) => r.querySelector(s);
const view = $('#view');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/* ---------- icons ---------- */
const I = {
  back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chev: '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  dumbbell: '<svg viewBox="0 0 24 24"><path d="M2.5 10.5v3M5 8v8M8 7v10M8 12h8M16 7v10M19 8v8M21.5 10.5v3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  people: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5" fill="currentColor"/><circle cx="17" cy="9" r="2.8" fill="currentColor" opacity=".85"/><path d="M2.5 19c.5-3.6 3.2-5.5 6.5-5.5s6 1.9 6.5 5.5zM15.5 19c-.2-1.8-.9-3.3-2-4.4 1-.6 2.2-.9 3.5-.9 2.7 0 4.6 1.6 5 4.3V19z" fill="currentColor"/></svg>',
  cal: '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  playc: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 8.5l5.5 3.5-5.5 3.5z" fill="currentColor"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M7 4.5l13 7.5-13 7.5z" fill="currentColor"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  sliders: '<svg viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 12h4M12 12h8M4 17h12M20 17h0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="16" cy="7" r="2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="10" cy="12" r="2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="18" cy="17" r="2" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  checkc: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 12.3l2.8 2.8L16.5 9.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  grip: '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  pencil: '<svg viewBox="0 0 24 24"><path d="M4 20l1-4.5L15.5 5a2.1 2.1 0 0 1 3 3L8 18.5zM14 6.5l3 3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  reset: '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M19 8a8 8 0 0 0-14 1M5 4v5h5M5 16a8 8 0 0 0 14-1M19 20v-5h-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="4" fill="currentColor"/><path d="M4 20.5c.6-4.2 3.9-6.5 8-6.5s7.4 2.3 8 6.5z" fill="currentColor"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  squat: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2.2" fill="currentColor"/><path d="M3 8.5h18M12 8v5l-3.5 2 1 4M12 13l3.5 2-1 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  target: '<svg viewBox="0 0 24 24"><circle cx="11" cy="13" r="8" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="11" cy="13" r="4" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="11" cy="13" r="1.2" fill="currentColor"/><path d="M14 10l6-6M17 4h3v3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  film: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10 9.5l4.5 2.5-4.5 2.5z" fill="currentColor"/></svg>',
  chart: '<svg viewBox="0 0 24 24"><path d="M4 19h16M6 15l4-4 3 3 5-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  summary: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8 12.3l2.8 2.8L16.5 9.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  palette: '<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.7 1.8-1.7H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="7.5" cy="11.5" r="1.4" fill="currentColor"/><circle cx="10.5" cy="7.5" r="1.4" fill="currentColor"/><circle cx="15" cy="7.8" r="1.4" fill="currentColor"/></svg>',
  logi: '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 10h7M8.5 14h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
};

/* ---------- theme (accent colour) ---------- */
export const THEMES = [
  { id: 'green', name: 'Green', acc: '#6b8e6b', d: '#4f6f51', dd: '#2f4a33', tint: '#eef2ec', tint2: '#e3eadf', badge: '#cfdccb', track: '#d6e0d3' },
  { id: 'blue', name: 'Blue', acc: '#4a7fb5', d: '#33689e', dd: '#1f4470', tint: '#ebf1f8', tint2: '#dde8f3', badge: '#c4d6ea', track: '#cfdcea' },
  { id: 'red', name: 'Red', acc: '#c0504d', d: '#a33c3a', dd: '#6e2322', tint: '#f9eceb', tint2: '#f3dedd', badge: '#ebc3c2', track: '#eccfce' },
  { id: 'orange', name: 'Orange', acc: '#d9822b', d: '#b96a1c', dd: '#7a4210', tint: '#fbf1e6', tint2: '#f6e4d0', badge: '#eecfaa', track: '#efd9bf' },
  { id: 'purple', name: 'Purple', acc: '#7e5ca8', d: '#66478f', dd: '#412b60', tint: '#f2eef8', tint2: '#e8e0f2', badge: '#d5c6e8', track: '#dcd1ea' },
  { id: 'pink', name: 'Pink', acc: '#d0679a', d: '#b44f80', dd: '#7a2f53', tint: '#fbedf3', tint2: '#f6e0ea', badge: '#efc4d8', track: '#efd0de' },
  { id: 'charcoal', name: 'Charcoal', acc: '#4a4f55', d: '#373b40', dd: '#1f2226', tint: '#f0f1f2', tint2: '#e4e6e8', badge: '#cdd0d4', track: '#d6d8db' },
];
const THEME_KEY = 'pt-app.theme';
function applyTheme(id) {
  const t = THEMES.find(x => x.id === id) || THEMES[0], r = document.documentElement.style;
  r.setProperty('--acc', t.acc); r.setProperty('--acc-d', t.d); r.setProperty('--acc-dd', t.dd); r.setProperty('--tint', t.tint);
  r.setProperty('--tint2', t.tint2); r.setProperty('--badge', t.badge); r.setProperty('--track', t.track);
  document.documentElement.dataset.theme = t.id;
  return t;
}
const currentTheme = () => localStorage.getItem(THEME_KEY) || 'green';
function setTheme(id) { localStorage.setItem(THEME_KEY, id); return applyTheme(id); }
applyTheme(currentTheme());
function openThemePicker() {
  const draw = () => `<h3>App colour</h3><p class="sub">Pick an accent colour. It applies across the whole app and is saved on this phone.</p>
    <div class="swatches">${THEMES.map(t => `<button class="sw${t.id === currentTheme() ? ' on' : ''}" data-id="${t.id}" style="--sc:${t.acc}" aria-label="${t.name}" aria-pressed="${t.id === currentTheme()}"><i style="background:${t.acc}">${I.check}</i><span>${t.name}</span></button>`).join('')}</div>
    <div class="btns"><button class="btn" data-close>Done</button></div>`;
  openSheet(draw(), p => { p.addEventListener('click', e => { const b = e.target.closest('.sw'); if (!b) return; const t = setTheme(b.dataset.id); p.innerHTML = '<div class="grab"></div>' + draw(); toast(t.name + ' theme'); }); });
}

/* ---------- state ---------- */
let S;
function load() {
  try { S = JSON.parse(localStorage.getItem(KEY)); } catch { S = null; }
  if (!S || S.v !== 1) S = seedState();
  // New day: fresh copy of the day's plan (not started yet); keep clients and settings.
  const today = 'w-' + new Date().toISOString().slice(0, 10);
  if (S.workout.id !== today) { const fresh = seedState().workout; fresh.startedAt = null; fresh.exercises.forEach(e => { e.done = false; e.log = []; }); S.workout = fresh; S.clips = {}; }
  save();
}
function save() { localStorage.setItem(KEY, JSON.stringify(S)); }
const W = () => S.workout;
const exById = id => W().exercises.find(e => e.id === id);
const lib = id => LIBRARY.find(v => v.id === id) || {};
const doneCount = () => W().exercises.filter(e => e.done).length;
const fmtW = w => (Math.round(w * 10) / 10).toString();
function fmtDur(ms) {
  const s = Math.max(0, Math.floor(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), ss = s % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}` : `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}
const elapsed = () => !W().startedAt ? 0 : (W().finishedAt || Date.now()) - W().startedAt;
function startWorkout() { if (!W().startedAt) { W().startedAt = Date.now(); W().finishedAt = null; save(); } }

/* ---------- ui helpers ---------- */
let timers = [];
const every = (ms, fn) => { fn(); timers.push(setInterval(fn, ms)); };
function toast(msg, ms = 2200) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => t.hidden = true, ms); }
const sheet = $('#sheet');
let sheetCleanup = null;
function openSheet(html, onMount) {
  sheet.innerHTML = `<div class="pane" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
  sheet.hidden = false;
  sheetCleanup = onMount?.(sheet.firstElementChild) || null;
}
function closeSheet() {
  sheet.querySelectorAll('video').forEach(v => { v.pause(); v.removeAttribute('src'); v.load(); });
  sheetCleanup?.(); sheetCleanup = null; sheet.hidden = true; sheet.innerHTML = '';
}
sheet.addEventListener('click', e => { if (e.target === sheet || e.target.closest('[data-close]')) closeSheet(); });
function pickVideo() {
  return new Promise(res => {
    const inp = $('#filepick'); inp.value = '';
    inp.onchange = () => res(inp.files[0] || null);
    inp.click();
  });
}
async function toBlob(file) { return new Blob([await file.arrayBuffer()], { type: file.type || 'video/mp4' }); }
function posterOf(blob) {
  return new Promise(res => {
    const v = document.createElement('video'); const url = URL.createObjectURL(blob);
    let done = false; const fin = d => { if (done) return; done = true; URL.revokeObjectURL(url); res(d); };
    v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = url;
    v.onloadeddata = () => { try { v.currentTime = Math.min(0.5, (v.duration || 1) / 3); } catch { fin(null); } };
    v.onseeked = () => { try { const c = document.createElement('canvas'); const w = 360; c.width = w; c.height = Math.round(w * (v.videoHeight || 9) / (v.videoWidth || 16)); c.getContext('2d').drawImage(v, 0, 0, c.width, c.height); fin(c.toDataURL('image/jpeg', .75)); } catch { fin(null); } };
    v.onerror = () => fin(null); setTimeout(() => fin(null), 5000);
  });
}
function openPlayer({ title, src, sub = '' }) {
  openSheet(`<h3>${esc(title)}</h3><video src="${esc(src)}" controls playsinline autoplay muted></video><p class="sub" style="margin-top:8px">${esc(sub)}</p><div class="btns"><button class="btn ghost" data-close>Close</button></div>`);
}

/* ---------- router ---------- */
const routes = { home: renderHome, library: renderLibrary, log: renderLog, done: renderDone, progress: renderProgress };
function route() {
  timers.forEach(clearInterval); timers = [];
  if (!sheet.hidden) closeSheet();
  const [name = 'home', arg] = (location.hash.replace(/^#\/?/, '').replace(/\?.*/, '') || 'home').split('/');
  const tab = name === 'done' ? 'log' : (routes[name] ? name : 'home');
  document.querySelectorAll('#tabs a').forEach(a => a.classList.toggle('on', a.dataset.tab === tab));
  (name === 'log' && arg ? renderDetail : (routes[name] || renderHome))(arg && decodeURIComponent(arg));
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);

/* ---------- Home ---------- */
async function renderHome() {
  const n = doneCount(), tot = W().exercises.length, uploads = (await allVideos().catch(() => [])).filter(v => v.kind === 'library').length;
  const label = W().finishedAt ? 'View summary' : W().startedAt ? 'Continue' : 'Start';
  view.innerHTML = `
  <div class="row"><h1 class="h1 sp">Hi ${esc(S.user.name)}</h1><div class="hdrbtns"><button class="avatar pal" id="pal" aria-label="App colour" title="App colour">${I.palette}</button><button class="avatar" id="me" aria-label="Your name and settings">${I.user}</button></div></div>
  <section class="hero">
    <div class="kicker"><span class="badge">${I.dumbbell}</span>Today's workout</div>
    <h3>${esc(W().title)}</h3><p>${esc(W().focus)}</p>
    <div class="bar" aria-label="${n} of ${tot} done"><i style="width:${Math.round(n / tot * 100)}%"></i></div>
    <a class="btn" id="start" href="#/log">${label} ${I.chev}</a>
  </section>
  <div class="stats">
    <a class="stat" href="#/progress"><div class="n"><span class="ic">${I.people}</span>${S.totalClients}</div><div class="l">Clients ›</div></a>
    <a class="stat" href="#/progress"><div class="n"><span class="ic">${I.cal}</span>${S.sessionsThisWeek}</div><div class="l">Sessions this week ›</div></a>
    <a class="stat" href="#/library"><div class="n"><span class="ic">${I.playc}</span>${LIBRARY.length + uploads}</div><div class="l">Videos ›</div></a>
  </div>
  <div class="sectit">Quick links</div>
  <div class="quick">
    <a class="card" href="#/log">${I.logi}Today's log</a>
    <a class="card" href="#/log/${encodeURIComponent((W().exercises.find(e => !e.done) || W().exercises[0]).id)}">${I.dumbbell}Log a set</a>
    <a class="card" href="#/library">${I.film}Video library</a>
    <a class="card" href="#/progress">${I.chart}Client progress</a>
    <a class="card" href="#/done">${I.summary}Workout summary</a>
    <a class="card" href="#/library" id="qup">${I.plus}Upload video</a>
  </div>
  <p class="foot">Data is saved on this phone only. PT Coach ${APP_VERSION} · <button id="reset">Reset demo data</button></p>`;
  $('#pal').onclick = openThemePicker;
  $('#qup').onclick = () => { uploadFlow(); };
  $('#start').onclick = e => { if (W().finishedAt) { e.preventDefault(); location.hash = '#/done'; return; } startWorkout(); };
  $('#me').onclick = () => openSheet(`<h3>Your name</h3><input type="text" id="nm" value="${esc(S.user.name)}" autocomplete="given-name"><div class="btns"><button class="btn ghost" id="col">${I.palette.replace('<svg', '<svg width="20" height="20"')} App colour: ${esc((THEMES.find(t => t.id === currentTheme()) || THEMES[0]).name)}</button></div><div class="btns"><button class="btn ghost" data-close>Cancel</button><button class="btn" id="ok">Save</button></div>`,
    p => { $('#col', p).onclick = () => openThemePicker(); $('#ok', p).onclick = () => { S.user.name = $('#nm', p).value.trim() || 'Coach'; save(); closeSheet(); renderHome(); }; });
  $('#reset').onclick = async () => { if (!confirm('Reset all demo data and delete uploaded videos on this phone?')) return; await clearVideos().catch(() => {}); S = seedState(); save(); toast('Demo data reset'); renderHome(); };
}

/* ---------- Library ---------- */
let libFilter = 'All', libQuery = '';
async function renderLibrary() {
  const ups = (await allVideos().catch(() => [])).filter(v => v.kind === 'library').sort((a, b) => b.createdAt - a.createdAt);
  view.innerHTML = `
  <h1 class="h1" style="font-size:32px">Video library</h1>
  <p class="sub">Explore exercise videos by muscle group and movement.</p>
  <div class="search">${I.search}<input id="q" type="search" placeholder="Search exercises…" value="${esc(libQuery)}" enterkeyhint="search" aria-label="Search exercises"><span class="div"></span><button class="iconbtn" id="sort" aria-label="Sort">${I.sliders}</button></div>
  <div class="chips" id="chips">${['All', 'Upper', 'Lower', 'Core', 'My uploads'].map(c => `<button class="chip${c === libFilter ? ' on' : ''}" data-c="${c}">${c}</button>`).join('')}</div>
  <div class="grid" id="grid"></div>
  <button class="fab" id="fab" aria-label="Upload a video">${I.plus}</button>`;
  const items = [...ups.map(u => ({ ...u, upload: true })), ...LIBRARY];
  const draw = () => {
    const q = libQuery.trim().toLowerCase();
    let list = items.filter(v => (libFilter === 'All' || (libFilter === 'My uploads' ? v.upload : v.group === libFilter)) && (!q || `${v.name} ${v.group} ${v.muscles || ''}`.toLowerCase().includes(q)));
    if (S.libSort === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    $('#grid').innerHTML = list.length ? list.map(v => `<button class="tile" data-id="${esc(v.id)}"><div class="th">${v.upload ? (v.poster ? `<img src="${v.poster}" alt="">` : `<div class="ph">${I.film}</div>`) : `<img src="${v.img}" alt="">`}<span class="play${v.mid ? ' mid' : ''}">${I.play}</span></div><div class="nm">${esc(v.name)}</div><div class="meta">${esc(v.group)}${v.muscles ? ' · ' + esc(v.muscles) : ''}${v.upload ? ' · uploaded' : ''}</div></button>`).join('')
      : `<div class="empty" style="grid-column:1/-1">${libFilter === 'My uploads' && !q ? 'No uploads yet. Tap + to add a video from your phone.' : 'No videos match.'}</div>`;
  };
  draw();
  $('#q').oninput = e => { libQuery = e.target.value; draw(); };
  $('#chips').onclick = e => { const c = e.target.closest('.chip'); if (!c) return; libFilter = c.dataset.c; document.querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === c)); draw(); };
  $('#sort').onclick = () => { S.libSort = S.libSort === 'az' ? 'default' : 'az'; save(); draw(); toast(S.libSort === 'az' ? 'Sorted A–Z' : 'Default order'); };
  $('#grid').onclick = async e => {
    const t = e.target.closest('.tile'); if (!t) return;
    const v = items.find(x => x.id === t.dataset.id);
    if (v.upload) {
      const rec = await getVideo(v.id); const url = URL.createObjectURL(rec.blob);
      openSheet(`<h3>${esc(v.name)}</h3><video src="${url}" controls playsinline autoplay muted></video><p class="sub" style="margin-top:8px">${esc(v.group)} · saved on this phone</p><div class="btns"><button class="btn ghost" id="del">Delete</button><button class="btn" data-close>Close</button></div>`,
        p => { $('#del', p).onclick = async () => { if (!confirm('Delete this video?')) return; await delVideo(v.id); closeSheet(); toast('Video deleted'); renderLibrary(); }; return () => URL.revokeObjectURL(url); });
    } else openPlayer({ title: v.name, src: v.src, sub: `${v.group} · ${v.muscles} · Form video ${v.dur}` });
  };
  $('#fab').onclick = uploadFlow;
}
async function uploadFlow() {
  const file = await pickVideo(); if (!file) return;
  const blob = await toBlob(file); const url = URL.createObjectURL(blob);
  const base = (file.name || 'My video').replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').slice(0, 40);
  openSheet(`<h3>Add to library</h3><video src="${url}" controls playsinline muted></video>
    <label class="f" for="vn">Name</label><input type="text" id="vn" value="${esc(base)}">
    <label class="f" for="vg">Muscle group</label><select id="vg"><option>Upper</option><option>Lower</option><option>Core</option></select>
    <div class="btns"><button class="btn ghost" data-close>Cancel</button><button class="btn" id="ok">Save video</button></div>`,
    p => {
      $('#ok', p).onclick = async () => {
        $('#ok', p).disabled = true; $('#ok', p).textContent = 'Saving…';
        const id = 'up-' + Date.now().toString(36);
        const rec = { id, kind: 'library', name: $('#vn', p).value.trim() || 'My video', group: $('#vg', p).value, blob, poster: await posterOf(blob), createdAt: Date.now() };
        await putVideo(rec); await uploadLibraryVideo(blob, rec);
        closeSheet(); libFilter = 'My uploads'; toast('Saved to your library'); renderLibrary();
      };
      return () => URL.revokeObjectURL(url);
    });
}

/* ---------- Workout log list ---------- */
function renderLog() {
  const w = W(), n = doneCount(), tot = w.exercises.length;
  view.innerHTML = `
  <div class="loghead">
    <div class="topbar"><a class="iconbtn" href="#/home" aria-label="Back">${I.back}</a><h2>Today’s workout</h2><span></span></div>
    <div class="elapsed"><span class="dot${w.startedAt && !w.finishedAt ? ' live' : ''}"></span><span id="el">${w.startedAt ? (w.finishedAt ? 'Finished ' : 'Elapsed ') + fmtDur(elapsed()) : 'Not started'}</span></div>
    <div class="meta"><span>${esc(w.title)} • ${n} of ${tot} done</span><span class="pill">${n} of ${tot} done</span></div>
  </div>
  ${w.startedAt ? '' : '<button class="btn block" id="go" style="margin-bottom:12px">Start workout</button>'}
  <ul class="list" id="list">${w.exercises.map(e => `
    <li class="ex card" data-id="${e.id}">
      <button class="chk${e.done ? ' on' : ''}" aria-label="${e.done ? 'Mark not done' : 'Mark done'}">${I.check}</button>
      <a class="info" href="#/log/${e.id}"><div class="nm">${esc(e.name)}</div><div class="ds">${e.sets} × ${e.reps} • ${fmtW(e.weight)} kg${e.log.length && !e.done ? ` · ${e.log.length}/${e.sets} sets` : ''}</div></a>
      <a class="thumb" href="#/log/${e.id}" aria-label="Form video"><img src="${lib(e.id).thumb || lib(e.id).img}" alt=""><span class="play c">${I.play}</span></a>
      <button class="grip" aria-label="Drag to reorder">${I.grip}</button>
    </li>`).join('')}</ul>
  <p class="hint">Press and hold an exercise, or drag ☰, to reorder.</p>
  <button class="btn block${n === tot ? '' : ' ghost'}" id="finish">${w.finishedAt ? 'View workout summary' : 'Finish workout'}</button>`;
  if (w.startedAt && !w.finishedAt) every(1000, () => { const el = $('#el'); if (el) el.textContent = 'Elapsed ' + fmtDur(elapsed()); });
  $('#go') && ($('#go').onclick = () => { startWorkout(); renderLog(); every(1000, () => { const el = $('#el'); if (el) el.textContent = 'Elapsed ' + fmtDur(elapsed()); }); });
  $('#finish').onclick = () => {
    if (!w.finishedAt) { if (n < tot && !confirm(`Only ${n} of ${tot} exercises done. Finish anyway?`)) return; startWorkout(); w.finishedAt = Date.now(); save(); syncWorkout(w); }
    location.hash = '#/done';
  };
  const list = $('#list');
  list.addEventListener('click', e => {
    if (dragJustEnded) { e.preventDefault(); e.stopPropagation(); return; }
    const c = e.target.closest('.chk'); if (!c) return;
    const ex = exById(c.closest('.ex').dataset.id); ex.done = !ex.done; if (ex.done) startWorkout(); save(); renderLog();
  }, true);
  enableDrag(list, ids => { w.exercises.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)); save(); });
}

/* Press-and-hold (or grip) drag to reorder, touch friendly. */
let dragJustEnded = false;
function enableDrag(list, onDone) {
  let el = null, startY = 0, pid = null, holdT = null, downY = 0, armed = null;
  const GAP = 10;
  const begin = (item, y) => {
    el = item; startY = y; el.classList.add('dragging'); navigator.vibrate?.(15);
  };
  let lastY = 0, scrollRaf = 0;
  const autoScroll = () => {
    scrollRaf = 0; if (!el) return;
    const bottomEdge = window.innerHeight - (document.getElementById('tabs')?.offsetHeight || 0);
    const d = lastY < 90 ? -8 : lastY > bottomEdge - 70 ? 8 : 0;
    if (!d) return;
    const before = window.scrollY; window.scrollBy(0, d); const moved = window.scrollY - before;
    if (moved) { startY -= moved; move(lastY); }
    scrollRaf = requestAnimationFrame(autoScroll);
  };
  const move = y => {
    lastY = y; if (!scrollRaf) scrollRaf = requestAnimationFrame(autoScroll);
    let dy = y - startY;
    const prev = el.previousElementSibling, next = el.nextElementSibling;
    if (next && dy > next.offsetHeight / 2 + GAP / 2) { list.insertBefore(next, el); startY += next.offsetHeight + GAP; dy = y - startY; }
    else if (prev && dy < -(prev.offsetHeight / 2 + GAP / 2)) { list.insertBefore(el, prev); startY -= prev.offsetHeight + GAP; dy = y - startY; }
    el.style.transform = `translateY(${dy}px) scale(1.02)`;
  };
  const end = () => {
    clearTimeout(holdT); holdT = null; armed = null;
    if (!el) return;
    const item = el; el = null; item.classList.remove('dragging'); item.classList.add('drop'); item.style.transform = '';
    setTimeout(() => item.classList.remove('drop'), 200);
    dragJustEnded = true; setTimeout(() => dragJustEnded = false, 350);
    onDone([...list.children].map(li => li.dataset.id));
  };
  list.addEventListener('pointerdown', e => {
    const item = e.target.closest('.ex'); if (!item || e.button > 0) return;
    pid = e.pointerId; downY = e.clientY;
    if (e.target.closest('.grip')) { e.preventDefault(); item.setPointerCapture?.(pid); begin(item, e.clientY); return; }
    if (e.target.closest('.chk')) return;
    armed = item; holdT = setTimeout(() => { if (armed) { item.setPointerCapture?.(pid); begin(item, downY); } }, 380);
  });
  list.addEventListener('pointermove', e => {
    if (e.pointerId !== pid) return;
    if (el) { e.preventDefault(); move(e.clientY); }
    else if (armed && Math.abs(e.clientY - downY) > 8) { clearTimeout(holdT); armed = null; }
  });
  list.addEventListener('pointerup', end); list.addEventListener('pointercancel', end);
  // iOS: stop the page scrolling while an item is being dragged.
  list.addEventListener('touchmove', e => { if (el) e.preventDefault(); }, { passive: false });
  list.addEventListener('contextmenu', e => { if (el || armed) e.preventDefault(); });
}

/* ---------- Workout log detail ---------- */
let rest = { end: 0, dur: 90, left: 90 };
let audioCtx;
function beep() { try { audioCtx ||= new (window.AudioContext || window.webkitAudioContext)(); const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.frequency.value = 880; g.gain.value = .15; o.connect(g).connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + .35); } catch {} navigator.vibrate?.([200, 100, 200]); }
function renderDetail(id) {
  const e = exById(id); if (!e) { location.hash = '#/log'; return; }
  const v = lib(e.id);
  if (!rest.end) { rest.dur = e.rest; rest.left = e.rest; }
  const idx = W().exercises.indexOf(e), nextEx = W().exercises.slice(idx + 1).find(x => !x.done) || W().exercises.find(x => !x.done && x !== e);
  view.innerHTML = `
  <div class="topbar"><a class="iconbtn" href="#/log" aria-label="Back">${I.back}</a><h2>Log workout</h2><span></span></div>
  <div class="extitle">${esc(e.name)}</div>
  <div class="vidbox" id="vb"><img src="${v.img}" alt=""><span class="play big c">${I.play}</span><span class="cap">Form video · ${v.dur}</span><button class="cover" aria-label="Play form video"></button></div>
  ${['sets', 'reps', 'weight'].map(k => `<div class="field card" data-k="${k}"><span class="k">${k[0].toUpperCase() + k.slice(1)}</span><span class="v">${fmtW(e[k])}</span>${k === 'weight' ? '<span class="u">kg</span>' : ''}<button class="iconbtn ed" aria-label="Edit ${k}">${I.pencil}</button></div>`).join('')}
  <div class="rest"><span class="clock">${I.clock}</span><button id="rt" style="border:0;background:none;text-align:left;padding:0;cursor:pointer;flex:1"><div class="lbl">Rest timer</div><div class="t" id="rtv">${rest.dur}s</div></button><button class="iconbtn" id="rr" aria-label="Reset rest timer" style="color:var(--acc-d)">${I.reset}</button></div>
  <button class="btn block" id="save">Save set</button>
  <div class="sets"><h4>Completed sets <span style="color:var(--mute);font-weight:400">(${e.log.length}/${e.sets})</span></h4><div id="sl"></div></div>
  <button class="btn block" id="add">${I.plus.replace('<svg', '<svg width="20" height="20"')} Add set</button>
  <div id="addrow"></div>
  <div class="gap"></div>
  ${nextEx ? `<a class="btn block ghost" href="#/log/${nextEx.id}">Next: ${esc(nextEx.name)} ›</a>` : `<a class="btn block ghost" href="#/log">Back to today’s workout</a>`}`;
  const drawSets = () => {
    $('#sl').innerHTML = e.log.length ? e.log.map((s, i) => `<div class="setrow"><span class="num">${i + 1}</span><span class="tx">${s.reps}×${fmtW(s.weight)}kg${i >= e.sets ? ' <small style="color:var(--mute)">extra</small>' : ''}</span><button class="xbtn" data-i="${i}" aria-label="Remove set ${i + 1}">✕</button><span class="ok">${I.checkc}</span></div>`).join('')
      : '<div class="setrow"><span class="tx" style="color:var(--mute);font-size:15px">No sets yet. Tap Save set after each set.</span></div>';
    $('.sets h4 span').textContent = `(${e.log.length}/${e.sets})`;
  };
  drawSets();
  const commit = () => { e.done = e.log.length >= e.sets; if (e.log.length) startWorkout(); save(); };
  $('#sl').onclick = ev => { const b = ev.target.closest('.xbtn'); if (!b) return; e.log.splice(+b.dataset.i, 1); commit(); drawSets(); };
  $('#vb .cover').onclick = () => { $('#vb').innerHTML = `<video src="${v.src}" controls playsinline autoplay muted loop></video>`; };
  view.querySelectorAll('.field').forEach(f => f.querySelector('.ed').onclick = () => {
    const k = f.dataset.k, span = f.querySelector('.v');
    if (f.querySelector('input')) return;
    const inp = document.createElement('input'); inp.type = 'number'; inp.inputMode = k === 'weight' ? 'decimal' : 'numeric'; inp.step = k === 'weight' ? '0.5' : '1'; inp.min = '0'; inp.value = e[k];
    span.replaceWith(inp); inp.focus(); inp.select();
    const done = () => { const n = parseFloat(inp.value); if (!isNaN(n) && n >= 0) e[k] = k === 'weight' ? n : Math.max(1, Math.round(n)); commit(); renderDetail(id); };
    inp.onblur = done; inp.onkeydown = ev => { if (ev.key === 'Enter') inp.blur(); };
  });
  const tick = () => {
    const el = $('#rtv'); if (!el) return;
    if (rest.end) { const left = Math.ceil((rest.end - Date.now()) / 1000); if (left <= 0) { rest.end = 0; rest.left = rest.dur; beep(); toast('Rest over. Next set!'); } else rest.left = left; }
    el.textContent = rest.end ? `${rest.left}s` : (rest.left !== rest.dur ? `${rest.left}s (paused)` : `${rest.dur}s`);
    el.classList.toggle('run', !!rest.end);
  };
  every(250, tick);
  const startRest = () => { rest.end = Date.now() + rest.left * 1000; tick(); };
  $('#rt').onclick = () => { if (rest.end) { rest.left = Math.ceil((rest.end - Date.now()) / 1000); rest.end = 0; } else startRest(); tick(); };
  $('#rr').onclick = () => { rest.end = 0; rest.left = rest.dur = e.rest; tick(); };
  $('#save').onclick = () => {
    e.log.push({ reps: e.reps, weight: e.weight }); commit(); drawSets();
    rest.left = rest.dur; startRest();
    toast(e.done && e.log.length === e.sets ? `${e.name} complete!` : `Set ${e.log.length} saved · rest ${rest.dur}s`);
  };
  $('#add').onclick = () => {
    if ($('#addrow').children.length) { $('#addrow input').focus(); return; }
    $('#addrow').innerHTML = `<div class="setrow edit"><span class="num">${e.log.length + 1}</span><label>Reps<input type="number" inputmode="numeric" id="ar" value="${e.reps}" min="1"></label><label>Weight (kg)<input type="number" inputmode="decimal" step="0.5" id="aw" value="${e.weight}" min="0"></label><button class="btn small" id="ak">${I.check.replace('<svg', '<svg width="18" height="18"')}</button><button class="xbtn" id="ax" aria-label="Cancel">✕</button></div>`;
    $('#ak').onclick = () => { const r = parseInt($('#ar').value, 10), wt = parseFloat($('#aw').value); if (!(r > 0) || !(wt >= 0)) { toast('Enter reps and weight'); return; } e.log.push({ reps: r, weight: wt }); commit(); $('#addrow').innerHTML = ''; drawSets(); toast(`Set ${e.log.length} added`); };
    $('#ax').onclick = () => $('#addrow').innerHTML = '';
  };
}

/* ---------- Post-workout ---------- */
async function renderDone() {
  const w = W(), n = doneCount(), tot = w.exercises.length;
  const vol = w.exercises.reduce((a, e) => a + e.log.reduce((b, s) => b + s.reps * s.weight, 0), 0);
  let tip = 'Nice consistency. Keep it up!';
  for (const e of w.exercises) { const pb = S.prevBest[e.id]; const best = Math.max(0, ...e.log.map(s => s.weight)); if (pb && best > pb.weight) { tip = `New personal best on ${e.name}!`; break; } }
  const clips = Object.fromEntries((await allVideos().catch(() => [])).filter(v => v.kind === 'clip').map(v => [v.exId, v]));
  const mins = Math.max(1, Math.round(elapsed() / 60000));
  view.innerHTML = `
  <div class="banner">${n === tot ? 'Great job!' : 'Nice work!'}</div>
  <div class="center"><div class="donebig">${I.check}</div><div class="h2">${w.finishedAt ? 'Workout complete' : 'Workout in progress'}</div><div>${esc(w.title)} • ${n} of ${tot} done • ${w.startedAt ? mins + ' min' : 'not started'}</div></div>
  <div class="two"><div class="card"><div class="k">Volume</div><div class="v">${Math.round(vol).toLocaleString('en-AU')} kg</div></div><div class="card"><div class="k">Tip</div><div class="v s">${esc(tip)}</div></div></div>
  <div class="pwhead"><h3>Send form clip to your trainer</h3><p>Your PT will get a notification and can compare your clip next to the exercise form video.</p></div>
  <div id="pwl">${w.exercises.map(e => {
    const c = S.clips[e.id] && clips[e.id];
    return `<div class="pw card" data-id="${e.id}"><span class="chk${e.done ? ' on' : ''}" aria-hidden="true">${I.check}</span>
      <div class="info"><div class="nm">${esc(e.name)}</div><div class="ds">${e.sets} × ${e.reps} • ${fmtW(e.weight)} kg</div></div>
      <button class="bigthumb" data-act="${c ? 'compare' : 'form'}" aria-label="${c ? 'Compare clip' : 'Play form video'}"><img src="${c?.poster || lib(e.id).thumb || lib(e.id).img}" alt=""><span class="play c">${I.play}</span></button>
      ${c ? `<div class="sent"><span class="tag">✓ Sent to trainer</span><button data-act="compare">Compare</button></div>`
          : `<button class="addclip" data-act="add" aria-label="Add clip for ${esc(e.name)}"><span class="pl">${I.plus}</span><span>add clip</span></button>`}
    </div>`; }).join('')}</div>
  <div class="gap"></div>
  ${w.finishedAt ? '' : '<a class="btn block" href="#/log">Back to workout</a><div class="gap"></div>'}
  <a class="btn block ghost" href="#/home">Done</a>`;
  $('#pwl').onclick = async ev => {
    const b = ev.target.closest('[data-act]'); if (!b) return;
    const e = exById(b.closest('.pw').dataset.id), act = b.dataset.act;
    if (act === 'form') return openPlayer({ title: e.name, src: lib(e.id).src, sub: 'Exercise form video' });
    if (act === 'add') return addClip(e);
    if (act === 'compare') return compareClip(e);
  };
}
async function addClip(e, replacing) {
  const file = await pickVideo(); if (!file) return;
  toast('Sending clip…');
  const blob = await toBlob(file);
  const id = 'clip-' + e.id;
  const rec = { id, kind: 'clip', exId: e.id, name: e.name + ' clip', blob, poster: await posterOf(blob), createdAt: Date.now() };
  await putVideo(rec);
  const up = await uploadClip(blob, rec);          // stub: Cloudflare Stream later
  await notifyTrainer({ exId: e.id, uid: up.uid }); // stub: Supabase + push later
  S.clips[e.id] = { clipId: id, sentAt: Date.now(), status: 'sent' }; save();
  if (replacing) closeSheet();
  toast(`Clip sent to your trainer ✓`);
  if (location.hash.startsWith('#/done')) renderDone();
}
async function compareClip(e) {
  const rec = await getVideo('clip-' + e.id); if (!rec) { toast('Clip not found'); return; }
  const url = URL.createObjectURL(rec.blob);
  const when = new Date(S.clips[e.id]?.sentAt || rec.createdAt).toLocaleString('en-AU', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
  openSheet(`<h3>${esc(e.name)}: compare</h3>
    <div class="cmp"><figure><video id="va" src="${lib(e.id).src}" playsinline muted loop controls></video><figcaption>Form video</figcaption></figure>
    <figure><video id="vb2" src="${url}" playsinline muted loop controls></video><figcaption>Your clip · sent ${esc(when)}</figcaption></figure></div>
    <p class="sub" style="margin:10px 0 0">✓ Sent to trainer. They'll see these side by side.</p>
    <div class="btns"><button class="btn" id="both">${I.play.replace('<svg', '<svg width="16" height="16"')} Play both</button></div>
    <div class="btns" style="margin-top:10px"><button class="btn ghost" id="rep">Replace clip</button><button class="btn ghost" id="rm">Remove</button><button class="btn ghost" data-close>Close</button></div>`,
    p => {
      $('#both', p).onclick = () => { const a = $('#va', p), b = $('#vb2', p); a.currentTime = 0; b.currentTime = 0; a.play().catch(() => {}); b.play().catch(() => {}); };
      $('#rep', p).onclick = () => addClip(e, true);
      $('#rm', p).onclick = async () => { await delVideo('clip-' + e.id); delete S.clips[e.id]; save(); closeSheet(); toast('Clip removed'); renderDone(); };
      return () => URL.revokeObjectURL(url);
    });
}

/* ---------- Client progress ---------- */
let showDetails = false;
function chartSVG(data) {
  const Wd = 340, H = 200, L = 34, R = 22, T = 10, B = 30, max = 120, cw = Wd - L - R, ch = H - T - B;
  const x = i => L + (cw * i) / (data.length - 1), y = v => T + ch - (ch * v) / max;
  const pts = data.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  let g = '';
  for (let v = 0; v <= max; v += 20) g += `<line x1="${L}" x2="${Wd - R}" y1="${y(v)}" y2="${y(v)}" stroke="#e3e7e2" stroke-dasharray="${v ? '3 3' : ''}"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="#555">${v}</text>`;
  data.forEach((_, i) => g += `<text x="${x(i)}" y="${H - 12}" text-anchor="middle" font-size="10" fill="#555">Week ${i + 1}</text>`);
  const last = data.length - 1;
  return `<svg class="chart" viewBox="0 0 ${Wd} ${H}" role="img" aria-label="Strength over ${data.length} weeks: ${data.join(', ')} kg">
    <defs><linearGradient id="gf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--acc)" stop-opacity=".28"/><stop offset="1" style="stop-color:var(--acc)" stop-opacity="0"/></linearGradient></defs>
    ${g}<text x="${L + 4}" y="${T + 2}" font-size="10" fill="#555" dominant-baseline="hanging">kg</text>
    <polygon points="${x(0)},${y(0)} ${pts} ${x(last)},${y(0)}" fill="url(#gf)"/>
    <polyline points="${pts}" fill="none" style="stroke:var(--acc)" stroke-width="2.2" stroke-linejoin="round"/>
    ${data.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="${i === last ? 4.5 : 3.2}" style="fill:var(--acc)"/>`).join('')}
    <circle cx="${x(last)}" cy="${y(data[last])}" r="8" fill="none" style="stroke:var(--acc)" stroke-width="1.6" opacity=".6"/></svg>`;
}
function renderProgress() {
  const c = S.clients.find(x => x.id === S.activeClient) || S.clients[0];
  const recent = [...c.recent];
  if (c.id === W().client && W().finishedAt) recent.unshift({ t: W().title + ' Strength', d: W().exercises.map(e => e.name).slice(0, 3).join(', '), at: new Date(W().finishedAt).toISOString().slice(0, 10) });
  const sent = Object.keys(S.clips).length;
  const dt = s => new Date(s + 'T12:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  const delta = (d, unit = '') => `<b style="${d < 0 ? 'color:#b0582f' : ''}">${d < 0 ? '↓' : '↑'} ${Math.abs(d)}${unit}</b> vs 4 weeks ago`;
  view.innerHTML = `
  <div class="row"><h1 class="h1 green sp">Client progress</h1><button class="iconbtn" id="bell" aria-label="Notifications" style="color:var(--acc-dd);position:relative">${I.bell}${sent ? `<span style="position:absolute;top:8px;right:8px;width:9px;height:9px;border-radius:50%;background:#c4593a"></span>` : ''}</button></div>
  <div class="chips" id="cl" style="padding-top:4px">${S.clients.map(x => `<button class="chip${x.id === c.id ? ' on' : ''}" data-id="${x.id}">${esc(x.name)}</button>`).join('')}</div>
  <div class="client"><div class="avatar">${I.user}</div><div><div class="nm">${esc(c.name)}</div><div class="st"><i></i>Client</div></div></div>
  <div class="chartbox"><div class="hd"><span>Strength over ${c.strength.length} weeks</span><button class="lnk" id="vd">${showDetails ? 'Hide details' : 'View details ›'}</button></div>${chartSVG(c.strength)}
    ${showDetails ? `<div class="card" style="padding:8px 12px;margin-top:6px;font-size:14px">${c.strength.map((v, i) => `<div class="row" style="padding:3px 0"><span class="sp">Week ${i + 1}</span><b>${v} kg</b>${i ? `<span style="color:var(--mute);width:52px;text-align:right">${v - c.strength[i - 1] >= 0 ? '+' : ''}${v - c.strength[i - 1]}</span>` : '<span style="width:52px"></span>'}</div>`).join('')}</div>` : ''}</div>
  <div class="mets">
    <div class="met card"><div class="ic">${I.squat}</div><div class="k">Max squat</div><div class="v">${c.maxLifts.squat} kg</div><div class="d">${delta(c.squatDelta, '%')}</div></div>
    <div class="met card"><div class="ic">${I.cal}</div><div class="k">Sessions</div><div class="v">${c.sessions}</div><div class="d">${delta(c.sessionsDelta)}</div></div>
    <div class="met card"><div class="ic">${I.target}</div><div class="k">Consistency</div><div class="v">${c.consistency}%</div><div class="d">${delta(c.consistencyDelta, '%')}</div></div>
  </div>
  <div class="sectit">Max lifts</div>
  <div class="lifts"><div class="card"><div class="k">Squat</div><div class="v">${c.maxLifts.squat} kg</div></div><div class="card"><div class="k">Bench</div><div class="v">${c.maxLifts.bench} kg</div></div><div class="card"><div class="k">Deadlift</div><div class="v">${c.maxLifts.deadlift} kg</div></div></div>
  <div class="row"><div class="sectit sp">Recent workouts</div><span class="lnk">${recent.length} total</span></div>
  <div class="card">${recent.map(r => `<div class="rw"><span class="ic">${I.dumbbell}</span><div class="tx"><div class="t1">${esc(r.t)}</div><div class="t2">${esc(r.d)}</div></div><span class="dt">${dt(r.at)}</span></div>`).join('')}</div>`;
  $('#cl').onclick = e => { const b = e.target.closest('.chip'); if (!b) return; S.activeClient = b.dataset.id; save(); renderProgress(); };
  $('#vd').onclick = () => { showDetails = !showDetails; renderProgress(); };
  $('#bell').onclick = () => toast(sent ? `${sent} form clip${sent > 1 ? 's' : ''} waiting for review` : 'No new notifications');
}

/* ---------- keyboard: hide tab bar while typing so it never floats mid-screen ---------- */
document.addEventListener('focusin', e => { if (e.target.matches('input,select,textarea')) document.body.classList.add('kb'); });
document.addEventListener('focusout', () => setTimeout(() => { if (!document.activeElement?.matches('input,select,textarea')) document.body.classList.remove('kb'); }, 50));

/* ---------- boot ---------- */
if (navigator.standalone || matchMedia('(display-mode: standalone)').matches) document.documentElement.dataset.standalone = '1';
load();
route();
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js').catch(err => console.warn('SW register failed', err));
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController && !reloaded) { reloaded = true; location.reload(); } });
}
