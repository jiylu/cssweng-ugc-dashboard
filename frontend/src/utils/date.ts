export function isValidDate(date: Date | undefined) {
  if (!date) return false
  if (!isNaN(date.getTime()) === false) return false
  const year = date.getFullYear()
  return year >= 1000 && year <= 9999
}

export function formatDate(date: Date | undefined) {
  if (!date) return ""
  const year = date.getUTCFullYear()
  if (year < 1000) return ""
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  return `${month}/${day}/${year}`
}