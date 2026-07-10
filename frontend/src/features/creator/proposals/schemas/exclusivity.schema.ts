import z from "zod"

export const exclusivitySchema = z.object({
  hasExclusivity: z.boolean(),
  exclusivityCategory: z.string().optional(),
  exclusivityCompetitorList: z.string().optional(),
  exclusivityStartDate: z.string().optional(),
  exclusivityEndDate: z.string().optional(),
  exclusivityFee: z.string().optional(),
  exclusivityTerritory: z.string().optional(),
})
.refine((data) => {
  if (!data.hasExclusivity) return true
  return !!data.exclusivityCategory
}, {
  message: "Category is required when exclusivity is enabled.",
  path: ["exclusivityCategory"]
})
.refine((data) => {
  if (!data.hasExclusivity) return true
  return !!data.exclusivityCompetitorList
}, {
  message: "Competitors list is required when exclusivity is enabled.",
  path: ["exclusivityCompetitorList"]
})
.refine((data) => {
  if (!data.hasExclusivity) return true
  return !!data.exclusivityStartDate
}, {
  message: "Start date is required when exclusivity is enabled.",
  path: ["exclusivityStartDate"]
})
.refine((data) => {
  if (!data.hasExclusivity || !data.exclusivityStartDate) return true
  const selected = new Date(data.exclusivityStartDate)
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  return selected >= today
}, {
  message: "Exclusivity start date must be starting from the present.",
  path: ["exclusivityStartDate"]
})
.refine((data) => {
  if (!data.hasExclusivity) return true
  return !!data.exclusivityEndDate
}, {
  message: "End date is required when exclusivity is enabled.",
  path: ["exclusivityEndDate"]
})
.refine((data) => {
  if (!data.hasExclusivity || !data.exclusivityStartDate || !data.exclusivityEndDate) return true
  return new Date(data.exclusivityEndDate) > new Date(data.exclusivityStartDate)
}, {
  message: "Exclusivity end date must be after start date.",
  path: ["exclusivityEndDate"]
})
.refine((data) => {
  if (!data.hasExclusivity) return true
  return !!data.exclusivityTerritory
}, {
  message: "Territory is required when exclusivity is enabled.",
  path: ["exclusivityTerritory"]
})
