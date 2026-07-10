import Button from "@/src/components/atoms/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import type { useRegister } from "../hooks/useRegister";

export interface ClientRegisterCardProps {
  registerForm: ReturnType<typeof useRegister>;
}

export default function ClientRegisterCard({
  registerForm,
}: ClientRegisterCardProps) {
  return (
    <section className="mx-auto w-full max-w-[780px] rounded border border-[#d8d4cb] bg-white px-10 py-8 max-md:px-6">
      <h2 className="text-[36px] leading-none text-[#141518] max-md:text-3xl">
        Create Your Account
      </h2>
      <div className="mt-3 h-px w-full bg-[#d8d4cb]" />

      <form
        className="mt-8 space-y-6"
        onSubmit={registerForm.handleSubmit}
        aria-busy={registerForm.isSubmitting}
      >
        <div className="grid grid-cols-2 gap-x-20 gap-y-6 max-md:grid-cols-1 max-md:gap-y-5">
          <label className="block space-y-2 text-[22px] leading-none text-[#5f5f5f]">
            First Name
            <input
              id="fname"
              className="h-12 w-full border border-[#9f9f9f] px-4 text-lg text-[#141518] placeholder:text-[#777] placeholder:italic focus:border-[#6b1fa8] focus:outline-none"
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

          <label className="block space-y-2 text-[22px] leading-none text-[#5f5f5f]">
            Last Name
            <input
              id="lname"
              className="h-12 w-full border border-[#9f9f9f] px-4 text-lg text-[#141518] placeholder:text-[#777] placeholder:italic focus:border-[#6b1fa8] focus:outline-none"
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

        <label className="block space-y-2 text-[22px] leading-none text-[#5f5f5f]">
          Email
          <input
            id="email"
            type="email"
            className="h-12 w-full border border-[#9f9f9f] px-5 text-lg text-[#141518] placeholder:text-[#777] placeholder:italic focus:border-[#6b1fa8] focus:outline-none disabled:bg-[#f6f5f2]"
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

        <div className="grid grid-cols-2 gap-x-20 gap-y-5 max-md:grid-cols-1">
          <label className="block space-y-2 text-[22px] leading-none text-[#5f5f5f]">
            Password
            <span className="relative block">
              <input
                id="password"
                type={registerForm.showPassword ? "text" : "password"}
                className="h-12 w-full border border-[#9f9f9f] px-5 pr-12 text-lg text-[#141518] placeholder:text-[#777] placeholder:italic focus:border-[#6b1fa8] focus:outline-none"
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

          <label className="block space-y-2 text-[22px] leading-none text-[#5f5f5f]">
            Confirm Password
            <span className="relative block">
              <input
                id="confirmPassword"
                type={registerForm.showConfirmPassword ? "text" : "password"}
                className="h-12 w-full border border-[#9f9f9f] px-5 pr-12 text-lg text-[#141518] placeholder:text-[#777] placeholder:italic focus:border-[#6b1fa8] focus:outline-none"
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

        <p className="max-w-[720px] text-lg leading-tight text-[#5f5f5f] max-md:text-base">
          Password must contain at least 6 characters, one uppercase letter
          (A-Z), one lowercase letter (a-z), one number (0-9), and one special
          character (!@#$%^&amp;*)
        </p>

        <div aria-live="polite" className="min-h-6 text-center">
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

        <div className="flex flex-col items-center gap-4">
          <Button
            type="submit"
            className="h-14 w-full max-w-[360px] rounded-none bg-[#6b1fa8] text-xl font-normal hover:bg-[#5f1a96]"
            disabled={registerForm.isSubmitting}
          >
            {registerForm.isSubmitting && (
              <Loader2 className="size-5 animate-spin" />
            )}
            {registerForm.isSubmitting ? "Creating Account..." : "Create Account"}
            {!registerForm.isSubmitting && <span className="ml-5">--&gt;</span>}
          </Button>

          <a href="/login" className="text-lg text-[#666] hover:underline">
            Already have an account?
          </a>
        </div>
      </form>
    </section>
  );
}
