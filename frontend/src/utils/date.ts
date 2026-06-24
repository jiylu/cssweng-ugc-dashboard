export function isValidDate(date: Date | undefined): boolean {
  if (!date) return false
  if (isNaN(date.getTime())) return false
  const year = date.getFullYear()
  return year >= 1000 && year <= 9999
}

export function formatDate(date: Date | undefined): string {
  if (!isValidDate(date)) return ""
  const d = date as Date
  const month = String(d.getUTCMonth() + 1).padStart(2, "0")
  const day = String(d.getUTCDate()).padStart(2, "0")
  return `${month}/${day}/${d.getUTCFullYear()}`
}