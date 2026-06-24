export function isValidDate(date: Date | undefined) {
  if (!date) return false
  if (!isNaN(date.getTime()) === false) return false
  const year = date.getFullYear()
  return year >= 1000 && year <= 9999
}

export function formatDate(date: Date | undefined) {
  if (!date) return ""
  if (date.getFullYear() < 1000) return ""
  return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
}