import { Card } from "@/src/components/atoms/card"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface CreativeDirectionProps {
  revisionRounds: number
  setRevisionRounds: (v: number) => void
  revisionDays: number
  setRevisionDays: (v: number) => void
  feedbackDays: number
  setFeedbackDays: (v: number) => void
  errors: Record<string, string>
}

const REVISION_OPTIONS = [
  { label: "1 Revision", value: 1 },
  { label: "2 Revisions", value: 2 },
  { label: "3+ Custom", value: 3 },
]

export function CreativeDirection({ revisionRounds, setRevisionRounds, revisionDays, setRevisionDays, feedbackDays, setFeedbackDays, errors }: CreativeDirectionProps) {
  return (
    <Card className="flex flex-col gap-4 w-full">
      <h2 className="text-2xl font-normal text-foreground">Creative Direction, Approval, and Revisions</h2>
      <Separator />

      {/* Revision Rounds */}
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">How many revisions would you like to include in the campaign?</p>
        <div className="grid grid-cols-3 gap-3">
          {REVISION_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRevisionRounds(option.value)}
              className={cn(
                "py-3 px-4 rounded-[3px] text-sm font-medium border transition-colors",
                revisionRounds === option.value
                  ? "bg-[#6b1fa8] text-white border-[#6b1fa8]"
                  : "bg-white text-foreground border-border hover:border-[#6b1fa8]"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        {errors.revisionRounds && <p className="text-xs text-[#ff6467]">{errors.revisionRounds}</p>}
      </div>

      {/* Revision Days Slider */}
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          Within how many business days should the revision be requested after submission?
        </p>
        <Slider
          min={1}
          max={14}
          step={1}
          value={[revisionDays]}
          onValueChange={(val) => setRevisionDays(val[0])}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 Day</span>
          <span className="text-[#6b1fa8] font-medium">{revisionDays} {revisionDays === 1 ? "Day" : "Days"}</span>
          <span>14 Days</span>
        </div>
        {errors.revisionDays && <p className="text-xs text-[#ff6467]">{errors.revisionDays}</p>}
      </div>

      {/* Feedback Days Slider */}
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          How many days after submission should a draft be automatically approved?
        </p>
        <Slider
          min={1}
          max={14}
          step={1}
          value={[feedbackDays]}
          onValueChange={(val) => setFeedbackDays(val[0])}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 Day</span>
          <span className="text-[#6b1fa8] font-medium">{feedbackDays} {feedbackDays === 1 ? "Day" : "Days"}</span>
          <span>14 Days</span>
        </div>
        {errors.feedbackDays && <p className="text-xs text-[#ff6467]">{errors.feedbackDays}</p>}
      </div>
      {errors.revisionRounds && <p className="text-xs mt-1 text-[#ff6467]">{errors.revisionRounds}</p>}
      {errors.revisionDays && <p className="text-xs mt-1 text-[#ff6467]">{errors.revisionDays}</p>}
      {errors.feedbackDays && <p className="text-xs mt-1 text-[#ff6467]">{errors.feedbackDays}</p>}
    </Card>
  )
}