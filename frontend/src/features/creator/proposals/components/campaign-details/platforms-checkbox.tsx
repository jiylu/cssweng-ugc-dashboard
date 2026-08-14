import { PlatformEntry } from "@/src/features/creator/proposals/types/campaign-setup.types"
import { usePlatformsCheckbox } from "@/src/features/creator/proposals/hooks/usePlatformCheckbox"
import { PlatformItem } from "@/src/features/creator/proposals/components/campaign-details/platform-item"

interface PlatformsCheckboxProps {
  value: PlatformEntry[]
  onChange: (value: PlatformEntry[]) => void
  errors?: Record<string, string>
}

export function PlatformsCheckbox({ value, onChange, errors }: PlatformsCheckboxProps) {
  const {
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
  } = usePlatformsCheckbox(value, onChange)

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
      {platforms.map((platform, index) => {
        const isOther = DEFAULT_PLATFORMS[index] === "Other"
        const checked = isChecked(platform)
        const errorKey = `platforms.${value.findIndex(p => p.platform === platform)}.handle`

        return (
          <PlatformItem
            key={platform}
            platform={platform}
            isOther={isOther}
            checked={checked}
            handle={getHandle(platform)}
            customLabel={customLabel}
            editingCustom={editingCustom}
            error={errors?.[errorKey]}
            onToggle={() => togglePlatform(platform)}
            onHandleChange={(handle) => updateHandle(platform, handle)}
            onEditCustom={editCustom}
            onCustomLabelChange={setCustomLabel}
            onCustomLabelBlur={() => setEditingCustom(false)}
          />
        )
      })}
    </div>
  )
}