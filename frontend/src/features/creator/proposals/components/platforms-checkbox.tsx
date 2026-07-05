import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const PLATFORMS = ["Facebook", "Instagram", "Tik-Tok", "Youtube", "Other"]

interface PlatformsCheckboxProps {
  value: string[]
  onChange: (value: string[]) => void
}

export function PlatformsCheckbox({ value, onChange }: PlatformsCheckboxProps) {
  function toggle(platform: string) {
    if (value.includes(platform)) {
      onChange(value.filter((p) => p !== platform))
    } else {
      onChange([...value, platform])
    }
  }

  return (
    <div className="flex flex-wrap gap-4">
      {PLATFORMS.map((platform) => (
        <div key={platform} className="flex items-center gap-2">
          <Checkbox
            id={platform}
            checked={value.includes(platform)}
            onCheckedChange={() => toggle(platform)}
          />
          <Label htmlFor={platform} className="text-sm text-muted-foreground cursor-pointer">
            {platform}
          </Label>
        </div>
      ))}
    </div>
  )
}