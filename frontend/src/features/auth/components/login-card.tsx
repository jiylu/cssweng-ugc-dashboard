import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/src/components/atoms/button";
import { useLogin } from "../hooks/useLogin";
import { CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export interface LoginCardProps {
  loginForm: ReturnType<typeof useLogin>;
}

export default function LoginCard({ loginForm }: LoginCardProps) {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col justify-center items-center box-border">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {loginForm.requiresTwoFactor ? "Verify it’s you" : "Login to your account"}
          </CardTitle>
          <CardDescription>
            {loginForm.requiresTwoFactor
              ? `Enter the 8-digit code sent to ${loginForm.form.email}`
              : "Enter your email below to login to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={loginForm.handleSubmit}
            aria-busy={loginForm.isSubmitting}
          >
            <div className="flex flex-col gap-6">
              {loginForm.requiresTwoFactor ? (
                <div className="grid gap-2">
                  <Label htmlFor="login-otp">Verification code</Label>
                  <Input
                    id="login-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={8}
                    placeholder="00000000"
                    value={loginForm.otp}
                    onChange={(event) =>
                      loginForm.setOtp(event.target.value.replace(/\D/g, "").slice(0, 8))
                    }
                    disabled={loginForm.isSubmitting}
                    className="text-center text-xl tracking-[0.45em]"
                    autoFocus
                  />
                  <button
                    type="button"
                    className="justify-self-start text-sm text-[#6b1fa8] hover:underline"
                    onClick={() => {
                      loginForm.setOtp("");
                      loginForm.setRequiresTwoFactor(false);
                    }}
                    disabled={loginForm.isSubmitting}
                  >
                    Use a different account
                  </button>
                </div>
              ) : (
                <>
              {/* email input */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="email@example.com"
                  value={loginForm.form.email}
                  onChange={(e) =>
                    loginForm.updateField("email", e.target.value)
                  }
                  disabled={loginForm.isSubmitting}
                />
                {loginForm.errors.email && (
                  <p role="alert" className="text-[#ff6467] text-sm">
                    {loginForm.errors.email}
                  </p>
                )}
              </div>

              {/* password input */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={loginForm.showPassword ? "text" : "password"}
                    placeholder=".........."
                    value={loginForm.form.password}
                    onChange={(e) =>
                      loginForm.updateField("password", e.target.value)
                    }
                    disabled={loginForm.isSubmitting}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    //size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-transparent"
                    onClick={() => loginForm.setShowPassword((prev) => !prev)}
                    disabled={loginForm.isSubmitting}
                    aria-label={
                      loginForm.showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {loginForm.showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {loginForm.errors.password && (
                  <p role="alert" className="text-[#ff6467]">
                    {loginForm.errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between -mt-[10px]">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={loginForm.rememberMe}
                    onChange={(e) => loginForm.setRememberMe(e.target.checked)}
                    disabled={loginForm.isSubmitting}
                    className="size-4 cursor-pointer accent-[#8811FF]"
                  />
                  <span className="-mb-[2px]">Remember me for 30 days</span>
                </label>

                <button
                  type="button"
                  onClick={() => router.push("/forgot-password")}
                  className="ml-auto inline-block cursor-pointer text-sm italic underline-offset-4 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
                </>
              )}

              <div aria-live="polite" className="min-h-6">
                {loginForm.submitError && (
                  <p role="alert" className="text-sm text-[#ff6467]">
                    {loginForm.submitError}
                  </p>
                )}
                {loginForm.submitSuccess && (
                  <p className="flex items-center gap-2 text-sm text-[#168a3a]">
                    <CheckCircle2 className="size-4" />
                    {loginForm.submitSuccess}
                  </p>
                )}
              </div>
            </div>

            <CardFooter className="flex-col gap-2 -mt-6">
              <Button
                type="submit"
                className="cursor-pointer w-full mt-3"
                disabled={
                  loginForm.isSubmitting ||
                  (loginForm.requiresTwoFactor && loginForm.otp.length !== 8)
                }
              >
                {loginForm.isSubmitting && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                {loginForm.isSubmitting
                  ? loginForm.requiresTwoFactor
                    ? "Verifying..."
                    : "Logging in..."
                  : loginForm.requiresTwoFactor
                    ? "Verify and login"
                    : "Login"}
              </Button>
              {!loginForm.requiresTwoFactor && <Button
                type="button"
                variant="outline"
                className="cursor-pointer w-full"
                onClick={() => router.push("/creator-register")}
                disabled={loginForm.isSubmitting}
              >
                Register
              </Button>}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
