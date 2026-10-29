// IndexedDB store for video blobs (library uploads and client form clips).
// Later: these blobs get uploaded to Cloudflare Stream (see backend.js) and only the Stream UID is kept.
const DB = 'pt-app', VER = 1;
let dbp;
function open() {
  return dbp ||= new Promise((res, rej) => {
    const r = indexedDB.open(DB, VER);
    r.onupgradeneeded = () => { const d = r.result; if (!d.objectStoreNames.contains('videos')) d.createObjectStore('videos', { keyPath: 'id' }); };
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
}
async function tx(mode, fn) {
  const d = await open();
  return new Promise((res, rej) => { const t = d.transaction('videos', mode); const s = t.objectStore('videos'); const out = fn(s); t.oncomplete = () => res(out.result ?? out); t.onerror = () => rej(t.error); });
}
export const putVideo = rec => tx('readwrite', s => s.put(rec));
export const getVideo = id => tx('readonly', s => s.get(id));
export const delVideo = id => tx('readwrite', s => s.delete(id));
export const allVideos = () => tx('readonly', s => s.getAll());
export const clearVideos = () => tx('readwrite', s => s.clear());
