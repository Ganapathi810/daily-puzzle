export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remaining = seconds % 60
  if (minutes === 0) return `${remaining}s`
  return `${minutes}m ${remaining}s`
}
