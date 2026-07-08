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
      <div className="flex items-center justify-between border-b border-[#d8d4cb] px-6 py-5">
        <h2 className="text-[30px] leading-none text-[#141518]">
          Campaign Overview
        </h2>
        <p className="text-base text-[#7b7771]">
          Start: {startDate} - End: {endDate}
        </p>
      </div>
      <div className="px-8 py-5 text-lg leading-relaxed text-[#5f5b56]">
        <p>
          <span className="text-[#141518]">Creator:</span> {creatorName}
        </p>
        <p className="mt-3 text-[#141518]">Campaign Description:</p>
        <p className="max-w-[820px]">{description}</p>
      </div>
    </section>
  );
}
