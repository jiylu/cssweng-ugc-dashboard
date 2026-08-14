interface CampaignOverviewCardProps {
  creatorName: string;
  description: string;
  endDate: string;
  startDate: string;
}

export default function CampaignOverviewCard({
  creatorName,
  description,
  endDate,
  startDate,
}: CampaignOverviewCardProps) {
  return (
    <section className="rounded border border-[#d8d4cb] bg-white">
      <div className="flex flex-col gap-2 border-b border-[#d8d4cb] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[28px] leading-none text-[#141518]">
          Campaign Overview
        </h2>
        <p className="text-sm text-[#7b7771] sm:text-base">
          Start: {startDate} - End: {endDate}
        </p>
      </div>
      <div className="px-6 py-5 text-base leading-relaxed text-[#5f5b56] sm:px-8 sm:text-lg">
        <p>
          <span className="text-[#141518]">Creator:</span> {creatorName}
        </p>
        <p className="mt-3 text-[#141518]">Campaign Description:</p>
        <p className="max-w-[820px] break-words">{description}</p>
      </div>
    </section>
  );
}
