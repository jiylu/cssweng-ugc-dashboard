import { useState } from "react"
import { ExpensesData } from "../types/expenses.types"

export function useExpenses() {
  const [reimbursementDays, setReimbursementDays] = useState(1)
  const [giftedProductTerms, setGiftedProductTerms] = useState("")
  const [cancellationDays, setCancellationDays] = useState(1)

  function buildData(): ExpensesData {
    return { reimbursementDays, giftedProductTerms, cancellationDays }
  }

  return { reimbursementDays, setReimbursementDays, giftedProductTerms, setGiftedProductTerms, cancellationDays, setCancellationDays, buildData }
}