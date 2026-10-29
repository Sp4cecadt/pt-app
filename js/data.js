// Seed data. Everything lives on the phone (localStorage) until a backend is added.
export const LIBRARY = [
  { id: 'back-squat', name: 'Back squat', group: 'Lower', muscles: 'Quads, glutes', dur: '0:42', img: 'img/back-squat.jpg', mid: true, src: 'vid/back-squat.mp4' },
  { id: 'squats', name: 'Squats', group: 'Lower', muscles: 'Quads, glutes', dur: '0:35', img: 'img/squats.jpg', src: 'vid/squats.mp4' },
  { id: 'deadlift', name: 'Deadlift', group: 'Lower', muscles: 'Hamstrings, back', dur: '0:51', img: 'img/deadlift.jpg', src: 'vid/deadlift.mp4' },
  { id: 'push-ups', name: 'Push-ups', group: 'Upper', muscles: 'Chest, triceps', dur: '0:29', img: 'img/push-ups.jpg', src: 'vid/push-ups.mp4' },
  { id: 'plank', name: 'Plank', group: 'Core', muscles: 'Abs, obliques', dur: '0:31', img: 'img/plank.jpg', src: 'vid/plank.mp4' },
  { id: 'bench-press', name: 'Bench press', group: 'Upper', muscles: 'Chest, triceps', dur: '0:44', img: 'img/bench-press.jpg', mid: true, src: 'vid/bench-press.mp4' },
  { id: 'overhead-press', name: 'Overhead press', group: 'Upper', muscles: 'Shoulders, triceps', dur: '0:38', img: 'img/overhead-press-hero.jpg', thumb: 'img/overhead-press.jpg', src: 'vid/overhead-press.mp4' },
  { id: 'barbell-row', name: 'Barbell row', group: 'Upper', muscles: 'Lats, upper back', dur: '0:40', img: 'img/barbell-row.jpg', mid: true, src: 'vid/barbell-row.mp4' },
  { id: 'romanian-deadlift', name: 'Romanian deadlift', group: 'Lower', muscles: 'Hamstrings, glutes', dur: '0:46', img: 'img/romanian-deadlift.jpg', mid: true, src: 'vid/romanian-deadlift.mp4' },
  { id: 'lat-pulldown', name: 'Lat pulldown', group: 'Upper', muscles: 'Lats, biceps', dur: '0:33', img: 'img/lat-pulldown.jpg', mid: true, src: 'vid/lat-pulldown.mp4' },
];

const ex = (id, name, sets, reps, weight, done, log = []) => ({ id, name, sets, reps, weight, rest: 90, done, log });

export function seedState(now = Date.now()) {
  return {
    v: 1,
    user: { name: 'Alex', role: 'trainer' },
    workout: {
      id: 'w-' + new Date(now).toISOString().slice(0, 10),
      title: 'Full body',
      focus: 'Focus on strength and muscle balance.',
      client: 'sam',
      startedAt: now - (24 * 60 + 17) * 1000, // matches the mockup: Elapsed 24:17
      finishedAt: null,
      exercises: [
        ex('back-squat', 'Back squat', 4, 6, 100, true, [{ reps: 6, weight: 100 }, { reps: 6, weight: 100 }, { reps: 6, weight: 100 }, { reps: 5, weight: 100 }]),
        ex('bench-press', 'Bench press', 4, 8, 70, true, [{ reps: 8, weight: 70 }, { reps: 8, weight: 70 }, { reps: 8, weight: 70 }, { reps: 9, weight: 70 }]),
        ex('overhead-press', 'Overhead press', 4, 8, 40, true, [{ reps: 8, weight: 40 }, { reps: 8, weight: 40 }, { reps: 7, weight: 40 }]),
        ex('barbell-row', 'Barbell row', 3, 10, 55, false),
        ex('romanian-deadlift', 'Romanian deadlift', 3, 8, 80, false),
        ex('lat-pulldown', 'Lat pulldown', 3, 12, 45, false),
      ],
    },
    clips: {}, // exerciseId -> { clipId, sentAt, status }
    prevBest: { 'bench-press': { reps: 8, weight: 67.5 } },
    clients: [
      { id: 'sam', name: 'Sam Lee', strength: [60, 66, 71, 77, 82, 87, 93, 100], maxLifts: { squat: 100, bench: 70, deadlift: 130 }, sessions: 24, sessionsDelta: 4, consistency: 92, consistencyDelta: 7, squatDelta: 8,
        recent: [
          { t: 'Lower Body Strength', d: 'Squat, Deadlift, Lunges', at: '2026-10-28' },
          { t: 'Upper Body Strength', d: 'Bench Press, Rows, Shoulder Press', at: '2026-10-26' },
          { t: 'Full Body Strength', d: 'Deadlift, Pull-ups, Core', at: '2026-10-23' },
          { t: 'Lower Body Strength', d: 'Squat, Romanian Deadlift, Calf Raise', at: '2026-10-21' },
          { t: 'Upper Body Strength', d: 'Overhead Press, Push-ups, Dips', at: '2026-10-19' },
        ] },
      { id: 'jordan', name: 'Jordan Wu', strength: [80, 82, 85, 85, 88, 92, 95, 97], maxLifts: { squat: 120, bench: 85, deadlift: 150 }, sessions: 18, sessionsDelta: 2, consistency: 81, consistencyDelta: -3, squatDelta: 5,
        recent: [
          { t: 'Upper Body Strength', d: 'Bench Press, Rows, Dips', at: '2026-10-27' },
          { t: 'Lower Body Strength', d: 'Squat, Deadlift, Lunges', at: '2026-10-24' },
          { t: 'Full Body Strength', d: 'Clean, Push Press, Core', at: '2026-10-20' },
        ] },
      { id: 'mia', name: 'Mia Patel', strength: [35, 38, 40, 44, 45, 49, 52, 55], maxLifts: { squat: 55, bench: 35, deadlift: 75 }, sessions: 30, sessionsDelta: 6, consistency: 97, consistencyDelta: 4, squatDelta: 12,
        recent: [
          { t: 'Full Body Strength', d: 'Goblet Squat, Push-ups, Plank', at: '2026-10-29' },
          { t: 'Lower Body Strength', d: 'Romanian Deadlift, Hip Thrust', at: '2026-10-27' },
          { t: 'Upper Body Strength', d: 'Lat Pulldown, Overhead Press', at: '2026-10-25' },
        ] },
    ],
    totalClients: 12,
    sessionsThisWeek: 8,
    activeClient: 'sam',
    libSort: 'default',
  };
}
