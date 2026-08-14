import { useRef } from "react";
import { Loader2 } from "lucide-react";
import Button from "@/src/components/atoms/button";
import type { useRegister } from "../hooks/useRegister";

export default function OtpCard({ registerForm }: { registerForm: ReturnType<typeof useRegister> }) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = registerForm.otp.padEnd(8, " ").slice(0, 8).split("");

  const updateDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = digits.map((item) => item.trim());
    next[index] = digit;
    registerForm.setOtp(next.join(""));
    if (digit && index < 7) inputs.current[index + 1]?.focus();
  };

  return (
    <section className="mx-auto w-full max-w-[760px] rounded border border-[#d8d4cb] bg-white px-8 py-10 max-md:px-5">
      <form onSubmit={registerForm.handleOtpSubmit} className="flex flex-col items-center">
        <h2 className="text-center text-[28px] text-[#141518]">Enter the 8-digit code sent to</h2>
        <p className="mt-1 max-w-full break-all text-center text-[#6b1fa8]">{registerForm.form.email}</p>
        <div className="my-10 grid w-full max-w-[284px] grid-cols-8 justify-items-center gap-1" onPaste={(event) => {
          const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
          if (pasted) { event.preventDefault(); registerForm.setOtp(pasted); inputs.current[Math.min(pasted.length, 7)]?.focus(); }
        }}>
          {digits.map((digit, index) => (
            <input key={index} ref={(node) => { inputs.current[index] = node; }} value={digit.trim()} inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"}
              aria-label={`Verification digit ${index + 1}`} maxLength={1} disabled={registerForm.isSubmitting}
              onChange={(event) => updateDigit(index, event.target.value)} onKeyDown={(event) => {
                if (event.key === "Backspace" && !digit.trim() && index > 0) inputs.current[index - 1]?.focus();
              }}
              className="h-12 w-full min-w-0 max-w-7 border border-[#9f9f9f] text-center text-lg focus:border-[#6b1fa8] focus:outline-none" />
          ))}
        </div>
        {registerForm.submitError && <p role="alert" className="mb-4 text-sm text-[#ff6467]">{registerForm.submitError}</p>}
        <Button type="submit" disabled={registerForm.isSubmitting || registerForm.otp.length !== 8}
          className="h-12 w-full max-w-[330px] rounded-none bg-[#6b1fa8] text-lg font-normal hover:bg-[#5f1a96]">
          {registerForm.isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <>Verify It’s You <span className="ml-5">--&gt;</span></>}
        </Button>
        <div className="mt-4 flex gap-4 text-sm text-[#666]">
          <button type="button" onClick={() => registerForm.resendOtp()} disabled={registerForm.isSubmitting} className="hover:underline">Resend code</button>
          <button type="button" onClick={registerForm.returnToDetails} disabled={registerForm.isSubmitting} className="hover:underline">Change email</button>
        </div>
      </form>
    </section>
  );
}
