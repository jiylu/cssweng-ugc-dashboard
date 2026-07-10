import { useState } from "react"
import { PlatformEntry } from "../types/campaign-setup.types"

const DEFAULT_PLATFORMS = ["Facebook", "Instagram", "Youtube", "TikTok", "Other"]

export function usePlatformsCheckbox(value: PlatformEntry[], onChange: (value: PlatformEntry[]) => void) {
  const [customLabel, setCustomLabel] = useState("Other")
  const [editingCustom, setEditingCustom] = useState(false)

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

  const platforms = DEFAULT_PLATFORMS.map((p) => p === "Other" ? customLabel : p)

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
  }
}
