interface StandardClausesSectionProps {
  partnershipTags: string
  contentRetentionMonths: number
  reimbursementDays: number
  cancellationDays: number
  revisionDays: number
  governingLaw: string
  disputeLocation: string
  extraNotes?: string
  hasExclusivity: boolean
  exclusivityCategory: string
  exclusivityTerritory: string
  exclusivityDays: string
}

export function StandardClausesSection({
  partnershipTags,
  contentRetentionMonths,
  reimbursementDays,
  cancellationDays,
  revisionDays,
  governingLaw,
  disputeLocation,
  extraNotes,
  hasExclusivity,
  exclusivityCategory,
  exclusivityTerritory,
  exclusivityDays,
}: StandardClausesSectionProps) {
  const clauses = [
    {
      title: "6. Posting Requirements and Disclosure",
      content: [
        "All content must prominently feature the product in the first 3 seconds.",
        `The creator must clearly disclose the partnership using FTC-compliant tags (e.g. ${partnershipTags || "#ad, #sponsored"}) in the first line of the caption.`,
        `Content must remain on the creator's feed for a minimum of ${contentRetentionMonths} months without being archived or deleted.`,
        "Tags to the brand's official handles must be visible and clickable.",
      ]
    },
    ...(hasExclusivity ? [{
      title: "7. Exclusivity",
      content: [
        `During the term of this agreement and for ${exclusivityDays} following the final post, the creator agrees not to partner with, promote, or feature any competing ${exclusivityCategory} brands in ${exclusivityTerritory}.`,
      ]
    }] : []),
    {
      title: "8. Expenses, Purchases, and Product Delivery",
      content: [
        "All content must prominently feature the product in the first 3 seconds.",
        `The creator must clearly disclose the partnership using FTC-compliant tags (e.g. ${partnershipTags || "#ad, #sponsored"}) in the first line of the caption.`,
        `Content must remain on the creator's feed for a minimum of ${contentRetentionMonths} months without being archived or deleted.`,
      ]
    },
    {
      title: "9. Cancellation and Termination",
      content: [
        `Either party may terminate this agreement with ${cancellationDays} days written notice prior to content creation.`,
        "If the creator fails to deliver content by the agreed deadline without prior communication, the brand reserves the right to terminate and withhold payment.",
        "If the brand cancels after content creation has begun, a 50% kill fee of the base rate will be paid to the creator.",
      ]
    },
    {
      title: "10. Creator Responsibilities",
      content: [
        `Either party may terminate this agreement with ${cancellationDays} days written notice prior to content creation.`,
        "If the creator fails to deliver content by the agreed deadline without prior communication, the brand reserves the right to terminate and withhold payment.",
        "If the brand cancels after content creation has begun, a 50% kill fee of the base rate will be paid to the creator.",
      ]
    },
    {
      title: "11. Brand Responsibilities",
      content: [
        "The Brand agrees to provide the Influencer with any necessary products, services, or information required to create the Content.",
        `The Brand will review and approve the Content in a timely manner within ${revisionDays} business days.`,
        "The Brand will pay the Influencer the agreed compensation upon the completion and delivery of the Creator.",
      ]
    },
    {
      title: "12. Confidentiality and Non-Disparagement",
      content: [
        "Both parties agree to keep any non-public information confidential, including but not limited to business strategies, product launches, and compensation details.",
      ]
    },
    {
      title: "13. Liability and Indemnity",
      content: [
        "Neither party shall be liable for any indirect, incidental or consequential damages arising out of or relating to this Agreement.",
      ]
    },
    {
      title: "14. General Terms",
      content: [
        "This Agreement constitutes the entire understanding between the parties and supersedes all prior agreements.",
        "Any amendments to the Agreement must be in writing and signed by both parties.",
        "Notices required under this Agreement shall be sent via email to the addresses provided above.",
        `This Agreement shall be governed by the laws of ${governingLaw || "[Province/State/Country]"}, and any disputes shall be resolved in the courts of ${disputeLocation || "[City/Province/State/Country]"}.`,
      ]
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {clauses.map((clause) => (
        <div key={clause.title} className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-foreground">{clause.title}</h3>
          <ul className="flex flex-col gap-1 list-disc list-inside">
            {clause.content.map((item, i) => (
              <li key={i} className="text-xs text-muted-foreground">{item}</li>
            ))}
          </ul>
        </div>
      ))}

      {extraNotes && (
        <div className="bg-muted/50 border border-border rounded-[3px] p-4">
          <p className="text-xs text-muted-foreground italic">{extraNotes}</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground italic border-t border-border pt-4">
        This agreement is provided for informational purposes only and does not constitute legal advice.
      </p>
    </div>
  )
}