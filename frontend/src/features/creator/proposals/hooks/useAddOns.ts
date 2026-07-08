import { useState } from "react"
import { AddOnItem } from "../components/add-ons/add-ons-form"
import { validateAddOns } from "../utils/validators"

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

// 1. Define the default rows matching the design mockup outside the hook
const DEFAULT_ADD_ONS: AddOnItem[] = [
  {
    id: "default-paid-ads",
    title: "Paid usage / ads",
    desc: "Brand may use approved content in paid social ads for [_ months] on [Meta/TikTok/etc.].",
    fee: 0,
  },
  {
    id: "default-whitelisting",
    title: "Whitelisting / Spark Ads",
    desc: "Creator will provide Meta Partnership Ad permission and/or TikTok Spark Code for [_ months].",
    fee: 0,
  },
  {
    id: "default-organic-extend",
    title: "Organic usage extension",
    desc: "Extends Brand organic reposting/website/email usage beyond the included period by [_ months].",
    fee: 0,
  },
  {
    id: "default-ugc-video",
    title: "Additional UGC video",
    desc: "One additional edited vertical video, [30–60 seconds], delivered to Brand.",
    fee: 0,
  },
  {
    id: "default-posted-reel",
    title: "Additional posted Reel/TikTok",
    desc: "One additional post on Creator's channel, including caption, tag, and disclosure.",
    fee: 0,
  },
  {
    id: "default-story-set",
    title: "Story set",
    desc: "[3] story frames with link sticker, tags, and disclosure, live for normal story duration.",
    fee: 0,
  },
  {
    id: "default-raw-footage",
    title: "Raw footage",
    desc: "Creator will provide unedited raw clips. Brand may use only within the approved usage scope.",
    fee: 0,
  },
  {
    id: "default-category-exclusivity",
    title: "Category exclusivity",
    desc: "Creator will not work with listed competitors/category for [_ days/months]. List competitors clearly.",
    fee: 0,
  },
  {
    id: "default-rush-turnaround",
    title: "Rush turnaround",
    desc: "Draft or final delivery required within [24–72 hours] or outside normal production timeline.",
    fee: 0,
  },
  {
    id: "default-revision",
    title: "Additional revision/reshoot",
    desc: "Additional revision round, reshoot, new hook, new CTA, or major creative change outside the included revision.",
    fee: 0,
  },
]

export function useAddOns() {
  // 2. Initialize the state with the defaults instead of an empty array []
  const [addOns, setAddOns] = useState<AddOnItem[]>(DEFAULT_ADD_ONS)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function addCustom() {
    setAddOns((prev) => [
      ...prev,
      {
        id: generateId(),
        title: "",
        desc: "",
        fee: 0,
      },
    ])
  }

  function removeAddOn(id: string) {
    setAddOns((prev) => prev.filter((a) => a.id !== id))
  }

  function adjustPrice(id: string, amount: number) {
    setAddOns((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, fee: Math.max(0, (a.fee ?? 0) + amount) } : a
      )
    )
  }

  function updateAddOn(id: string, field: keyof AddOnItem, value: string | number) {
    setAddOns((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    )
  }

  function validateForm(): boolean {
    const newErrors = validateAddOns({ addOns })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return { 
    addOns, 
    addCustom, 
    removeAddOn, 
    adjustPrice, 
    updateAddOn,
    errors,
    validateForm 
  }
}