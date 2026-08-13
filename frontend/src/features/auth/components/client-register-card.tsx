import Button from "@/src/components/atoms/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import type { useRegister } from "../hooks/useRegister";

export interface ClientRegisterCardProps {
  registerForm: ReturnType<typeof useRegister>;
  onContinueAsGuest: () => void;
  canContinueAsGuest: boolean;
}

export default function ClientRegisterCard({
  registerForm,
  onContinueAsGuest,
  canContinueAsGuest,
}: ClientRegisterCardProps) {
  return (
    <section className="mx-auto w-full max-w-[680px] rounded border border-[#d8d4cb] bg-white px-8 py-5 max-md:px-5">
      <h2 className="text-[28px] leading-none text-[#141518] max-md:text-2xl">
        Create Your Account
      </h2>
      <div className="mt-2 h-px w-full bg-[#d8d4cb]" />

      <form
        className="mt-5 space-y-4"
        onSubmit={registerForm.handleSubmit}
        aria-busy={registerForm.isSubmitting}
      >
        <div className="grid grid-cols-2 gap-x-10 gap-y-4 max-md:grid-cols-1 max-md:gap-y-4">
          <label className="block space-y-1.5 text-base leading-none text-[#5f5f5f]">
            First Name<span className="text-[#ff6467] ml-1">*</span>
            <input
              id="fname"
              className="h-10 w-full border border-[#9f9f9f] px-3 text-base text-[#141518] placeholder:text-[#777] placeholder:italic focus:border-[#6b1fa8] focus:outline-none"
              placeholder="Enter first name"
              value={registerForm.form.fname}
              onChange={registerForm.handleChange}
              disabled={registerForm.isSubmitting}
            />
            {registerForm.errors.fname && (
              <p role="alert" className="text-sm text-[#ff6467]">
                {registerForm.errors.fname}
              </p>
            )}
          </label>

          <label className="block space-y-1.5 text-base leading-none text-[#5f5f5f]">
            Last Name<span className="text-[#ff6467] ml-1">*</span>
            <input
              id="lname"
              className="h-10 w-full border border-[#9f9f9f] px-3 text-base text-[#141518] placeholder:text-[#777] placeholder:italic focus:border-[#6b1fa8] focus:outline-none"
              placeholder="Enter last name"
              value={registerForm.form.lname}
              onChange={registerForm.handleChange}
              disabled={registerForm.isSubmitting}
            />
            {registerForm.errors.lname && (
              <p role="alert" className="text-sm text-[#ff6467]">
                {registerForm.errors.lname}
              </p>
            )}
          </label>
        </div>

        <label className="block space-y-1.5 text-base leading-none text-[#5f5f5f]">
          Email<span className="text-[#ff6467] ml-1">*</span>
          <input
            id="email"
            type="email"
            className="h-10 w-full border border-[#9f9f9f] px-3 text-base text-[#141518] placeholder:text-[#777] placeholder:italic focus:border-[#6b1fa8] focus:outline-none disabled:bg-[#f6f5f2]"
            placeholder="Enter email"
            value={registerForm.form.email}
            onChange={registerForm.handleChange}
            disabled={registerForm.isSubmitting}
          />
          {registerForm.errors.email && (
            <p role="alert" className="text-sm text-[#ff6467]">
              {registerForm.errors.email}
            </p>
          )}
        </label>

        <div className="grid grid-cols-2 gap-x-10 gap-y-4 max-md:grid-cols-1">
          <label className="block space-y-1.5 text-base leading-none text-[#5f5f5f]">
            Password<span className="text-[#ff6467] ml-1">*</span>
            <span className="relative block">
              <input
                id="password"
                type={registerForm.showPassword ? "text" : "password"}
                className="h-10 w-full border border-[#9f9f9f] px-3 pr-10 text-base text-[#141518] placeholder:text-[#777] placeholder:italic focus:border-[#6b1fa8] focus:outline-none"
                placeholder="Enter a valid password"
                value={registerForm.form.password}
                onChange={registerForm.handleChange}
                disabled={registerForm.isSubmitting}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777]"
                onClick={() => registerForm.setShowPassword((prev) => !prev)}
                disabled={registerForm.isSubmitting}
                aria-label={
                  registerForm.showPassword ? "Hide password" : "Show password"
                }
              >
                {registerForm.showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </span>
            {registerForm.errors.password && (
              <p role="alert" className="text-sm text-[#ff6467]">
                {registerForm.errors.password}
              </p>
            )}
          </label>

          <label className="block space-y-1.5 text-base leading-none text-[#5f5f5f]">
            Confirm Password<span className="text-[#ff6467] ml-1">*</span>
            <span className="relative block">
              <input
                id="confirmPassword"
                type={registerForm.showConfirmPassword ? "text" : "password"}
                className="h-10 w-full border border-[#9f9f9f] px-3 pr-10 text-base text-[#141518] placeholder:text-[#777] placeholder:italic focus:border-[#6b1fa8] focus:outline-none"
                placeholder="Enter a valid password"
                value={registerForm.form.confirmPassword}
                onChange={registerForm.handleChange}
                disabled={registerForm.isSubmitting}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777]"
                onClick={() =>
                  registerForm.setShowConfirmPassword((prev) => !prev)
                }
                disabled={registerForm.isSubmitting}
                aria-label={
                  registerForm.showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {registerForm.showConfirmPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </span>
            {registerForm.errors.confirmPassword && (
              <p role="alert" className="text-sm text-[#ff6467]">
                {registerForm.errors.confirmPassword}
              </p>
            )}
          </label>
        </div>

        <p className="max-w-[620px] text-sm leading-tight text-[#5f5f5f]">
          Password must contain at least 6 characters, one uppercase letter
          (A-Z), one lowercase letter (a-z), one number (0-9), and one special
          character (!@#$%^&amp;*)
        </p>

        <div aria-live="polite" className="min-h-5 text-center">
          {registerForm.submitError && (
            <p role="alert" className="text-sm text-[#ff6467]">
              {registerForm.submitError}
            </p>
          )}
          {registerForm.submitSuccess && (
            <p className="text-sm text-green-600">
              {registerForm.submitSuccess}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <Button
            type="submit"
            className="h-11 w-full max-w-[320px] rounded-none bg-[#6b1fa8] text-lg font-normal hover:bg-[#5f1a96]"
            disabled={registerForm.isSubmitting}
          >
            {registerForm.isSubmitting && (
              <Loader2 className="size-5 animate-spin" />
            )}
            {registerForm.isSubmitting ? "Creating Account..." : "Create Account"}
            {!registerForm.isSubmitting && <span className="ml-5">--&gt;</span>}
          </Button>

          <div className="flex w-full max-w-[320px] items-center gap-3 py-1 text-sm text-[#777]">
            <span className="h-px flex-1 bg-[#d8d4cb]" />
            <span>or</span>
            <span className="h-px flex-1 bg-[#d8d4cb]" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full max-w-[320px] rounded-none border-[#6b1fa8] text-lg font-normal text-[#6b1fa8] hover:bg-[#f7f0fc] hover:text-[#5f1a96]"
            onClick={onContinueAsGuest}
            disabled={registerForm.isSubmitting || !canContinueAsGuest}
          >
            Continue as Guest
            <span className="ml-5">--&gt;</span>
          </Button>

          {!canContinueAsGuest && (
            <p className="text-center text-sm text-[#777]">
              Continue as Guest is available from a proposal invitation link.
            </p>
          )}

          <a href="/login" className="text-base text-[#666] hover:underline">
            Already have an account?
          </a>
        </div>
      </form>
    </section>
  );
}
