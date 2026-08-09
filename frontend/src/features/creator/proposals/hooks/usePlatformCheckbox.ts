import { useState } from "react"
import { PlatformEntry } from "../types/campaign-setup.types"

const DEFAULT_PLATFORMS = ["Facebook", "Instagram", "Youtube", "TikTok", "Other"]

export function usePlatformsCheckbox(value: PlatformEntry[], onChange: (value: PlatformEntry[]) => void) {
  const [customLabel, setCustomLabel] = useState("Other")
  const [editingCustom, setEditingCustom] = useState(false)

  const customPlatform = value.find((p) => !DEFAULT_PLATFORMS.includes(p.platform))
  const effectiveCustomLabel = customPlatform?.platform ?? customLabel

  const isChecked = (platform: string) => value.some((p) => p.platform === platform)
  const getHandle = (platform: string) => value.find((p) => p.platform === platform)?.handle ?? ""

  function togglePlatform(platform: string) {
    if (isChecked(platform)) {
      onChange(value.filter((p) => p.platform !== platform))
    } else {
      onChange([...value, { platform, handle: "" }])
    }
  }

  function updateHandle(platform: string, handle: string) {
    onChange(value.map((p) => p.platform === platform ? { ...p, handle } : p))
  }

  function editCustom() {
    setCustomLabel(effectiveCustomLabel)
    setEditingCustom(true)
  }

  const platforms = DEFAULT_PLATFORMS.map((p) => p === "Other" ? effectiveCustomLabel : p)

  return {
    platforms,
    DEFAULT_PLATFORMS,
    customLabel,
    setCustomLabel,
    editingCustom,
    setEditingCustom,
    isChecked,
    getHandle,
    togglePlatform,
    updateHandle,
    editCustom,
  }
}
