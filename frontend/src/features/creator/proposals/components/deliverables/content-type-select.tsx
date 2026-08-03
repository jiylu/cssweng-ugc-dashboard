import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CONTENT_TYPES } from "@/src/features/creator/proposals/utils/contentTypes"

interface ContentTypeSelectProps {
  platform: string
  contentType: string
  platformOptions: string[]
  onPlatformChange: (value: string) => void
  onContentTypeChange: (value: string) => void
  platformError?: string
  contentTypeError?: string
}

export function ContentTypeSelect({ platform, contentType, platformOptions, onPlatformChange, onContentTypeChange, platformError, contentTypeError }: ContentTypeSelectProps) {
  const contentTypeOptions = CONTENT_TYPES[platform] ?? (platform ? ["Custom"] : [])
  const hasPlatformOptions = platformOptions.length > 0

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-muted-foreground uppercase tracking-[0.03em]">CONTENT TYPE</label>
      <div className="flex items-center gap-1">
        {/* Platform */}
        <div className="flex flex-col gap-1">
          <Select value={platform} onValueChange={(v) => {
            onPlatformChange(v)
            onContentTypeChange("")
          }} disabled={!hasPlatformOptions}>
            <SelectTrigger className={`text-sm bg-white border-border rounded-[3px] ${!hasPlatformOptions ? "opacity-50" : ""}`}>
              <SelectValue placeholder={hasPlatformOptions ? "Set Platform" : "Select campaign platform first"} />
            </SelectTrigger>
            <SelectContent className="p-1">
              {platformOptions.map((p) => (
                <SelectItem key={p} value={p} className="text-sm rounded-[3px]">{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs mt-1 text-[#ff6467] min-h-[16px]">{platformError ?? ""}</p>
        </div>

        {/* Content Type */}
        <div className="flex flex-col gap-1">
          <Select
            value={contentType}
            onValueChange={onContentTypeChange}
            disabled={!platform}
          >
            <SelectTrigger className={`text-sm bg-white border-border rounded-[3px] ${!platform ? "opacity-50" : ""}`}>
              <SelectValue placeholder="Set Type" />
            </SelectTrigger>
            <SelectContent className="p-1">
              {contentTypeOptions.map((type) => (
                <SelectItem key={type} value={type} className="rounded-[3px]">{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs mt-1 text-[#ff6467] min-h-[16px]">{contentTypeError ?? ""}</p>
        </div>
      </div>
    </div>
  )
}
