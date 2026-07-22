import { Check } from "lucide-react";
import type { ProposalAddOn } from "../types/proposal-review.types";

interface OptionalAddOnsCardProps {
  addOns: ProposalAddOn[];
  onToggle?: (addOn: ProposalAddOn) => void;
}

export default function OptionalAddOnsCard({
  addOns,
  onToggle,
}: OptionalAddOnsCardProps) {
  return (
    <section className="rounded border border-[#d8d4cb] bg-white">
      <h2 className="px-7 py-6 text-[30px] leading-none text-[#141518]">
        Optional Add-ons
      </h2>

      <div className="max-h-[260px] overflow-y-auto pr-3">
        {addOns.map((addOn) => (
          <button
            type="button"
            key={addOn.id}
            className="grid w-full grid-cols-[48px_260px_1fr_140px] items-center border-t border-[#d8d4cb] px-7 py-5 text-left text-lg text-[#2f2d2a] transition-colors hover:bg-[#faf9f6]"
            aria-pressed={addOn.selected}
            onClick={() => onToggle?.(addOn)}
          >
            <span className="flex size-5 items-center justify-center rounded-[3px] bg-[#bdbab4] text-[#6b1fa8]">
              {addOn.selected && <Check className="size-4 stroke-[4]" />}
            </span>
            <span>{addOn.name}</span>
            <span>{addOn.description}</span>
            <span>{addOn.price}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
