import { Card } from "@/src/components/atoms/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface GeneralTermsProps {
  governingLaw: string
  setGoverningLaw: (v: string) => void
  disputeLocation: string
  setDisputeLocation: (v: string) => void
  extraNotes: string
  setExtraNotes: (v: string) => void
  errors: Record<string, string>
}

export function GeneralTerms({ 
  governingLaw, setGoverningLaw,
  disputeLocation, setDisputeLocation,
  extraNotes, setExtraNotes,
  errors
}: GeneralTermsProps) {
  return (
    <Card className="flex flex-col gap-4 w-full">
      <h2 className="text-2xl font-normal text-foreground">General Terms</h2>
      <Separator />

      <ol className="flex flex-col gap-3 list-decimal list-inside text-sm text-foreground leading-relaxed">
        <li>This Agreement is the full agreement between the Parties and replaces prior discussions about the Campaign.</li>
        <li>Changes must be made in writing and approved by both Parties, including by email.</li>
        <li>Notices may be sent by email to the contact information listed in this Agreement.</li>
        <li className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            This Agreement is governed by the laws of
            <Input
              value={governingLaw}
              onChange={(e) => setGoverningLaw(e.target.value)}
              placeholder="Province/State/Country"
              className="w-48 border-border rounded-[3px] text-sm inline-flex"
            />
            , and disputes will be handled in
            <Input
              value={disputeLocation}
              onChange={(e) => setDisputeLocation(e.target.value)}
              placeholder="Province/State/Country"
              className="w-48 border-border rounded-[3px] text-sm inline-flex"
            />
          </div>
          <span className="text-sm text-foreground">unless the Parties agree otherwise.</span>
          {errors.governingLaw && <p className="text-xs mt-1 text-[#ff6467]">{errors.governingLaw}</p>}
          {errors.disputeLocation && <p className="text-xs mt-1 text-[#ff6467]">{errors.disputeLocation}</p>}
        </li>
      </ol>

      <div className="flex flex-col gap-2 mt-2">
        <h3 className="text-lg font-normal text-foreground">Optional Extra Notes</h3>
        <Textarea
          value={extraNotes}
          onChange={(e) => setExtraNotes(e.target.value)}
          placeholder="Add any special terms, affiliate codes, performance bonuses, travel terms, event attendance, content removal requirements, or negotiated exceptions here."
          className="min-h-[160px] resize-none border border-border rounded-[3px] text-sm bg-transparent placeholder:text-muted-foreground placeholder:italic"
        />
        {errors.extraNotes && <p className="text-xs mt-1 text-[#ff6467]">{errors.extraNotes}</p>}
      </div>
    </Card>
  )
} 