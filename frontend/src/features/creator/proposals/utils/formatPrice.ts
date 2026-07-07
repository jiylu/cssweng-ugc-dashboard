export function adjustPriceValue(currentFormatted: string, amount: number): string {
  const currentVal = parseFloat(currentFormatted.replace(/,/g, "") || "0")
  const newVal = Math.max(0, currentVal + amount)
  return newVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}