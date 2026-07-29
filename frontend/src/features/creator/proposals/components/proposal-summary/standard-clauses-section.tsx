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
  const clauses: {
    title: string
    content: { text: string; dynamic: boolean }[][]
  }[] = [
    {
      title: "6. Posting Requirements and Disclosure",
      content: [
        [{ text: "All content must prominently feature the product in the first 3 seconds.", dynamic: false }],
        [
          { text: "The creator must clearly disclose the partnership using FTC-compliant tags (e.g. ", dynamic: false },
          { text: partnershipTags || "#ad, #sponsored", dynamic: true },
          { text: ") in the first line of the caption.", dynamic: false },
        ],
        [
          { text: "Content must remain on the creator's feed for a minimum of ", dynamic: false },
          { text: `${contentRetentionMonths} month/s`, dynamic: true },
          { text: " without being archived or deleted.", dynamic: false },
        ],
        [{ text: "Tags to the brand's official handles must be visible and clickable.", dynamic: false }],
      ]
    },
    ...(hasExclusivity ? [{
      title: "7. Exclusivity",
      content: [[
        { text: "During the term of this agreement and for ", dynamic: false },
        { text: exclusivityDays, dynamic: true },
        { text: " following the final post, the creator agrees not to partner with, promote, or feature any competing ", dynamic: false },
        { text: exclusivityCategory, dynamic: true },
        { text: " brands in ", dynamic: false },
        { text: exclusivityTerritory, dynamic: true },
        { text: ".", dynamic: false },
      ]]
    }] : []),
    {
      title: "8. Expenses, Purchases, and Product Delivery",
      content: [
        [{ text: "All content must prominently feature the product in the first 3 seconds.", dynamic: false }],
        [
          { text: "The creator must clearly disclose the partnership using FTC-compliant tags (e.g. ", dynamic: false },
          { text: partnershipTags || "#ad, #sponsored", dynamic: true },
          { text: ") in the first line of the caption.", dynamic: false },
        ],
        [
          { text: "Content must remain on the creator's feed for a minimum of ", dynamic: false },
          { text: `${contentRetentionMonths} month/s`, dynamic: true },
          { text: " without being archived or deleted.", dynamic: false },
        ],
      ]
    },
    {
      title: "9. Cancellation and Termination",
      content: [
        [
          { text: "Either party may terminate this agreement with ", dynamic: false },
          { text: `${cancellationDays} day/s`, dynamic: true },
          { text: " written notice prior to content creation.", dynamic: false },
        ],
        [{ text: "If the creator fails to deliver content by the agreed deadline without prior communication, the brand reserves the right to terminate and withhold payment.", dynamic: false }],
        [{ text: "If the brand cancels after content creation has begun, a 50% kill fee of the base rate will be paid to the creator.", dynamic: false }],
      ]
    },
    {
      title: "10. Creator Responsibilities",
      content: [
        [
          { text: "Either party may terminate this agreement with ", dynamic: false },
          { text: `${cancellationDays} day/s`, dynamic: true },
          { text: " written notice prior to content creation.", dynamic: false },
        ],
        [{ text: "If the creator fails to deliver content by the agreed deadline without prior communication, the brand reserves the right to terminate and withhold payment.", dynamic: false }],
        [{ text: "If the brand cancels after content creation has begun, a 50% kill fee of the base rate will be paid to the creator.", dynamic: false }],
      ]
    },
    {
      title: "11. Brand Responsibilities",
      content: [
        [{ text: "The Brand agrees to provide the Influencer with any necessary products, services, or information required to create the Content.", dynamic: false }],
        [
          { text: "The Brand will review and approve the Content in a timely manner within ", dynamic: false },
          { text: `${revisionDays} business day/s`, dynamic: true },
          { text: ".", dynamic: false },
        ],
        [{ text: "The Brand will pay the Influencer the agreed compensation upon the completion and delivery of the Creator.", dynamic: false }],
      ]
    },
    {
      title: "12. Confidentiality and Non-Disparagement",
      content: [
        [{ text: "Both parties agree to keep any non-public information confidential, including but not limited to business strategies, product launches, and compensation details.", dynamic: false }],
      ]
    },
    {
      title: "13. Liability and Indemnity",
      content: [
        [{ text: "Neither party shall be liable for any indirect, incidental or consequential damages arising out of or relating to this Agreement.", dynamic: false }],
      ]
    },
    {
      title: "14. General Terms",
      content: [
        [{ text: "This Agreement constitutes the entire understanding between the parties and supersedes all prior agreements.", dynamic: false }],
        [{ text: "Any amendments to the Agreement must be in writing and signed by both parties.", dynamic: false }],
        [{ text: "Notices required under this Agreement shall be sent via email to the addresses provided above.", dynamic: false }],
        [
          { text: "This Agreement shall be governed by the laws of ", dynamic: false },
          { text: governingLaw || "[Province/State/Country]", dynamic: true },
          { text: ", and any disputes shall be resolved in the courts of ", dynamic: false },
          { text: disputeLocation || "[City/Province/State/Country]", dynamic: true },
          { text: ".", dynamic: false },
        ],
      ]
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {clauses.map((clause) => (
        <div key={clause.title} className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-foreground">{clause.title}</h3>
          <ul className="flex flex-col gap-1 list-disc list-inside">
            {clause.content.map((segments, i) => (
              <li key={i} className="text-xs text-muted-foreground">
                {segments.map((segment, j) => (
                  <span key={j} className={segment.dynamic ? "text-[#6b1fa8]" : ""}>{segment.text}</span>
                ))}
              </li>
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