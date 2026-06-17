import { Card } from "@/src/components/atoms/card";

export interface ClientDetailsFormProps {
  contactEmail: string;
  setContactEmail: (v: string) => void;
  errors: Record<string, string>;
}

export default function ClientDetailsForm({ contactEmail, setContactEmail, errors }: ClientDetailsFormProps) {
  return (
    <Card>
      <h2 className="text-[26px] font-normal text-foreground">
        Client Information
      </h2>

      <p className="text-[16px] text-muted-foreground leading-relaxed -mt-4">
        Enter the client&apos;s name and contact email to send them access to view this campaign proposal.
      </p>

      <div className="flex flex-col gap-0">
        <label className="text-sm text-muted-foreground uppercase tracking-[0.03em] mt-0">
          CONTACT PERSON
        </label>

        <input
          type="text"
          className="w-full border-0 border-b border-border py-1.25 text-sm text-foreground bg-transparent outline-none transition-colors duration-200"
          placeholder="Enter name of contact person"
        />
      </div>

      <div className="flex flex-col gap-0">
        <label className="text-sm text-muted-foreground uppercase tracking-[0.03em] mt-0">
          CONTACT PERSON EMAIL
        </label>

        <input
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          type="email"
          className="w-full border-0 border-b border-border py-1.25 text-sm text-foreground bg-transparent outline-none transition-colors duration-200"
          placeholder="Enter email of contact person"
        />
        {errors.contactEmail && (
          <p className="text-xs mt-1 text-[#ff6467]">{errors.contactEmail}</p>
        )}
      </div>
    </Card>
  )
}