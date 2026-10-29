// Backend plug-in points. Nothing here talks to a server yet: the app runs fully on-device.
//
// Going live (see the emailed "PT app: cost report for going live"):
//  - Accounts, clients, workouts, sets, progress  -> Supabase (Free tier to start; Pro from $25/month)
//      supabase.from('workouts').upsert(...), supabase.from('sets').insert(...), Row Level Security per trainer.
//  - Exercise form videos and client form clips  -> Cloudflare Stream
//      ($5/month per 1,000 minutes stored, $1 per 1,000 minutes delivered; upload and encoding free)
//      Use a Supabase Edge Function to mint a Stream direct-upload URL, then PUT the blob from the phone.
//  - "Sent to trainer" notifications -> Supabase Realtime / Web Push (iOS 16.4+ supports push for Home Screen web apps).
//  - Store apps are optional: Apple Developer $99/year, Google Play $25 once. This PWA is free to host (GitHub Pages).

export const BACKEND_ENABLED = false;

/** Save the workout log. Later: Supabase upsert into `workouts` + `sets`. */
export async function syncWorkout(workout) {
  // TODO(Supabase): await supabase.from('workouts').upsert(toRow(workout));
  return { ok: true, local: true };
}

/** Upload a client's form clip. Later: Cloudflare Stream direct upload, returns the Stream video UID. */
export async function uploadClip(blob, meta) {
  // TODO(Cloudflare Stream): const { uploadURL, uid } = await fetch('/functions/v1/stream-upload-url').then(r => r.json());
  //                          await fetch(uploadURL, { method: 'POST', body: formDataWith(blob) });
  return { ok: true, uid: 'local-' + meta.id };
}

/** Tell the trainer a clip is waiting. Later: insert into `clip_reviews`, which triggers a push notification. */
export async function notifyTrainer(clip) {
  // TODO(Supabase): await supabase.from('clip_reviews').insert({ exercise_id: clip.exId, stream_uid: clip.uid });
  return { ok: true, simulated: true };
}

/** Upload a library video. Later: Cloudflare Stream; the library row lives in Supabase `videos`. */
export async function uploadLibraryVideo(blob, meta) {
  return { ok: true, uid: 'local-' + meta.id };
}
