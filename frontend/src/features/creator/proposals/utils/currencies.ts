export interface Currency {
  code: string
  name: string
}

export const CURRENCIES: Currency[] = [
  { code: "PHP", name: "Philippine Peso"},
  { code: "USD", name: "US Dollar"},
  { code: "EUR", name: "Euro"},
  { code: "GBP", name: "British Pound"},
  { code: "CAD", name: "Canadian Dollar"},
]