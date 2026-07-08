import { Check, ChevronsRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SlideToSignProps {
  onSigned: () => void;
}

export default function SlideToSign({ onSigned }: SlideToSignProps) {
  const [value, setValue] = useState(0);
  const [signed, setSigned] = useState(false);

  const handleChange = (nextValue: number) => {
    if (signed) return;

    setValue(nextValue);

    if (nextValue >= 96) {
      setSigned(true);
      setValue(100);
      onSigned();
    }
  };

  return (
    <div
      className={cn(
        "relative h-12 overflow-hidden rounded-none border border-[#d8d4cb] bg-[#eeeae2]",
        signed && "border-[#1f8a4a] bg-[#1f8a4a]",
      )}
    >
      <div
        className="absolute inset-y-0 left-0 bg-[#6b1fa8] transition-[width]"
        style={{ width: `${signed ? 100 : value}%` }}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-base text-[#7b7771]">
        <span className={cn(signed && "font-semibold text-white")}>
          {signed ? "Contract signed" : "Slide to accept and sign"}
        </span>
      </div>
      <div
        className="pointer-events-none absolute top-1 flex size-10 items-center justify-center rounded-none bg-white text-[#6b1fa8] shadow transition-[left]"
        style={{
          left: `calc(${signed ? 100 : value}% - ${(signed ? 100 : value) * 0.4}px)`,
        }}
      >
        {signed ? <Check className="size-5" /> : <ChevronsRight className="size-5" />}
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        aria-label="Slide to accept and sign contract"
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        disabled={signed}
        onChange={(event) => handleChange(Number(event.target.value))}
        onMouseUp={() => {
          if (!signed) setValue(0);
        }}
        onTouchEnd={() => {
          if (!signed) setValue(0);
        }}
      />
    </div>
  );
}
