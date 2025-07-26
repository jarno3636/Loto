// frontend/utils/time.ts

export function getTimeRemaining(createdAt: number): string {
  const duration = 5 * 60 * 1000; // 5 minutes in ms
  const now = Date.now();
  const timeLeft = createdAt + duration - now;

  if (timeLeft <= 0) return 'Ready to draw';

  const mins = Math.floor(timeLeft / 60000);
  const secs = Math.floor((timeLeft % 60000) / 1000);

  // Pad seconds with zero for single digits (e.g. 1m 05s)
  const paddedSecs = secs.toString().padStart(2, '0');
  return `${mins}m ${paddedSecs}s`;
}
