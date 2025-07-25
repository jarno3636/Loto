export function getTimeRemaining(createdAt: number): string {
  const duration = 5 * 60 * 1000; // 5 minutes
  const timeLeft = createdAt + duration - Date.now();
  if (timeLeft <= 0) return 'Ready to draw';
  const mins = Math.floor(timeLeft / 60000);
  const secs = Math.floor((timeLeft % 60000) / 1000);
  return `${mins}m ${secs}s`;
}
