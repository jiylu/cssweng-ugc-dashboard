import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Pencil } from "lucide-react"

interface PlatformItemProps {
  platform: string
  isOther: boolean
  checked: boolean
  handle: string
  customLabel: string
  editingCustom: boolean
  error?: string
  onToggle: () => void
  onHandleChange: (handle: string) => void
  onEditCustom: () => void
  onCustomLabelChange: (label: string) => void
  onCustomLabelBlur: () => void
}

export function PlatformItem({
  platform,
  isOther,
  checked,
  handle,
  customLabel,
  editingCustom,
  error,
  onToggle,
  onHandleChange,
  onEditCustom,
  onCustomLabelChange,
  onCustomLabelBlur,
}: PlatformItemProps) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={platform}
        checked={checked}
        onCheckedChange={onToggle}
      />

      <div className="flex items-center gap-1">
        <label
          htmlFor={platform}
          className={`text-sm cursor-pointer ${checked ? "text-[#6b1fa8] font-medium" : "text-foreground"}`}
        >
          {isOther && editingCustom ? (
            <input
              autoFocus
              value={customLabel}
              onChange={(e) => onCustomLabelChange(e.target.value)}
              onBlur={onCustomLabelBlur}
              className="border-b border-border text-sm outline-none w-20"
            />
          ) : (
            platform
          )}
        </label>
        {isOther && (
          <button
            type="button"
            onClick={onEditCustom}
            className="text-muted-foreground hover:text-foreground"
          >
            <Pencil size={12} />
          </button>
        )}
      </div>

      <div className="flex flex-col">
        <Input
          value={handle}
          onChange={(e) => onHandleChange(e.target.value)}
          placeholder={isOther ? "@Handle" : `@${platform} Handle`}
          disabled={!checked}
          className="text-sm border-border rounded-[3px] w-36 disabled:opacity-10"
        />
        {error && <p className="text-xs text-[#ff6467]">{error}</p>}
      </div>
    </div>
  )
}