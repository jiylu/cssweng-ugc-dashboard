const CURRENCY_SYMBOLS: Record<string, string> = {
  PHP: "₱",
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "$",
}

export function formatCurrency(amount: number, currency: string) {
  const code = currency.toUpperCase()
  const symbol = CURRENCY_SYMBOLS[code]
  const formattedAmount = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return symbol ? `${code}${symbol}${formattedAmount}` : `${code} ${formattedAmount}`
}
