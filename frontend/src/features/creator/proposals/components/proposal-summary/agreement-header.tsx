interface AgreementHeaderProps {
  brand: string
  creator: string
  effectiveDate: string
}

export function AgreementHeader({ brand, creator, effectiveDate }: AgreementHeaderProps) {
  return (
    <div className="border-b border-[#6b1fa8] pb-4 mb-6">
      <h2 className="text-xl text-[#6b1fa8] uppercase tracking-wide">Influencer Collaboration Agreement</h2>
      <p className="text-xs text-muted-foreground mb-1 pl-3">
        This agreement is entered into on <span className="text-[#6b1fa8]">{effectiveDate}</span> between <span className="text-[#6b1fa8]">{brand}</span> and <span className="text-[#6b1fa8]">{creator}</span>.
      </p>
    </div>
  )
}