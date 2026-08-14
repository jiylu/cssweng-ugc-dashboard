import { Card } from "@/src/components/atoms/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator"

export interface ClientDetailsFormProps {
  contactPerson: string;
  setContactPerson: (v: string) => void;
  contactEmail: string;
  setContactEmail: (v: string) => void;
  errors: Record<string, string>;
  readOnly?: boolean;
}

export default function ClientDetailsForm({ contactPerson, setContactPerson, contactEmail, setContactEmail, errors, readOnly = false }: ClientDetailsFormProps) {
  return (
    <Card className="h-fit">
      <h2 className="text-[26px] font-normal text-foreground">
        Client Information
      </h2>
      <Separator className="-mt-4 mb-2"/>


      <p className="text-[16px] text-muted-foreground leading-relaxed -mt-4">
        Enter the client&apos;s name and contact email to send them access to view this campaign proposal.
      </p>

      <div className="flex flex-col gap-0">
        <label className="text-sm text-muted-foreground uppercase tracking-[0.03em] mt-0">
          CONTACT PERSON<span className="ml-1 text-[#ff6467]">*</span>
        </label>

        <Input
          value={contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
          type="text"
          className="border-muted"
          placeholder="Enter name of contact person"
          disabled={readOnly}
        />
        {errors.contactPerson && (
          <p className="text-xs mt-1 text-[#ff6467]">{errors.contactPerson}</p>
        )}
      </div>

      <div className="flex flex-col gap-0">
        <label className="text-sm text-muted-foreground uppercase tracking-[0.03em]">
          CONTACT PERSON EMAIL<span className="text-[#ff6467] ml-1">*</span>
        </label>

        <Input
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          type="email"
          className="border-muted"
          placeholder="Enter email of contact person"
          disabled={readOnly}
        />
        {errors.contactEmail && (
          <p className="text-xs mt-1 text-[#ff6467]">{errors.contactEmail}</p>
        )}
      </div>

      <div className="border border-border rounded-[3px] p-3 text-muted-foreground flex flex-col gap-2 bg-[#F2F0EA]">
              <p>The client will receive the link of the proposal via email to review and digitally sign the proposal once submitted.</p>
      </div>
    </Card>
  )
}
