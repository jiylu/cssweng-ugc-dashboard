import { useRef } from "react";
import { Loader2 } from "lucide-react";
import Button from "@/src/components/atoms/button";

interface GuestOtpCardProps {
  email: string;
  error: string;
  isSubmitting: boolean;
  otp: string;
  onBack: () => void;
  onOtpChange: (otp: string) => void;
  onResend: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function GuestOtpCard({
  email,
  error,
  isSubmitting,
  otp,
  onBack,
  onOtpChange,
  onResend,
  onSubmit,
}: GuestOtpCardProps) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = otp.padEnd(8, " ").slice(0, 8).split("");

  const updateDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = digits.map((item) => item.trim());
    next[index] = digit;
    onOtpChange(next.join(""));
    if (digit && index < 7) inputs.current[index + 1]?.focus();
  };

  return (
    <section className="mx-auto w-full max-w-[760px] rounded border border-[#d8d4cb] bg-white px-8 py-10 max-md:px-5">
      <form onSubmit={onSubmit} className="flex flex-col items-center">
        <h2 className="text-center text-[28px] text-[#141518]">
          Verify Guest Access
        </h2>
        <p className="mt-2 text-center text-sm text-[#666]">
          Enter the 8-digit code sent to
        </p>
        <p className="mt-1 text-[#6b1fa8]">{email}</p>

        <div
          className="my-10 flex justify-center gap-4 max-sm:gap-1.5"
          onPaste={(event) => {
            const pasted = event.clipboardData
              .getData("text")
              .replace(/\D/g, "")
              .slice(0, 8);
            if (pasted) {
              event.preventDefault();
              onOtpChange(pasted);
              inputs.current[Math.min(pasted.length, 7)]?.focus();
            }
          }}
        >
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(node) => {
                inputs.current[index] = node;
              }}
              value={digit.trim()}
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              aria-label={`Guest verification digit ${index + 1}`}
              maxLength={1}
              disabled={isSubmitting}
              onChange={(event) => updateDigit(index, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Backspace" && !digit.trim() && index > 0) {
                  inputs.current[index - 1]?.focus();
                }
              }}
              className="h-20 w-14 border border-[#9f9f9f] text-center text-3xl focus:border-[#6b1fa8] focus:outline-none max-sm:h-14 max-sm:w-9"
            />
          ))}
        </div>

        {error && (
          <p role="alert" className="mb-4 text-sm text-[#ff6467]">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || otp.length !== 8}
          className="h-12 w-full max-w-[330px] rounded-none bg-[#6b1fa8] text-lg font-normal hover:bg-[#5f1a96]"
        >
          {isSubmitting ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              View Proposal <span className="ml-5">--&gt;</span>
            </>
          )}
        </Button>

        <div className="mt-4 flex gap-4 text-sm text-[#666]">
          <button type="button" onClick={onResend} disabled={isSubmitting} className="hover:underline">
            Resend code
          </button>
          <button type="button" onClick={onBack} disabled={isSubmitting} className="hover:underline">
            Back to registration
          </button>
        </div>
      </form>
    </section>
  );
}
