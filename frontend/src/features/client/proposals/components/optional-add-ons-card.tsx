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
    <section className="overflow-hidden rounded border border-[#a9a59e] bg-white">
      <h2 className="px-6 py-5 text-[28px] leading-none text-[#141518]">
        Optional Add-ons
      </h2>

      <div className="min-w-[720px]">
        <div className="grid grid-cols-[72px_minmax(300px,1fr)_110px_130px] bg-[#d8d4cb] px-6 py-3 text-base text-[#2f2d2a]">
          <span>Select</span>
          <span>Add-On</span>
          <span className="text-center">Qty.</span>
          <span>Price</span>
        </div>
      </div>
      <div className="max-h-[355px] min-w-[720px] overflow-y-auto">
        {addOns.map((addOn) => (
          <div
            key={addOn.id}
            className="grid grid-cols-[72px_minmax(300px,1fr)_110px_130px] items-center border-b border-[#d8d4cb] px-6 py-4 text-[#2f2d2a] last:border-b-0"
          >
            <button
              type="button"
              className="flex size-6 items-center justify-center rounded-[3px] border border-[#a9a59e] bg-white text-[#6b1fa8]"
              aria-label={`${addOn.selected ? "Remove" : "Select"} ${addOn.name}`}
              aria-pressed={addOn.selected}
              onClick={() => onToggle?.(addOn)}
            >
              {addOn.selected && <Check className="size-4 stroke-[3]" />}
            </button>
            <span className="pr-5">
              <span className="block text-base">{addOn.name}</span>
              <span className="mt-1 block text-xs leading-4 text-[#7b7771]">{addOn.description}</span>
            </span>
            <span className="text-center text-base">{addOn.selected ? 1 : "—"}</span>
            <span className="text-lg">{addOn.price}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
