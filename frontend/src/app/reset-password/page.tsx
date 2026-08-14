"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/src/components/atoms/button";
import { resetPassword } from "@/src/features/auth/services/auth-session";

export default function ResetPasswordPage() {
  const accessToken = useRef("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    accessToken.current =
      hash.get("access_token") ?? query.get("access_token") ?? "";
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 8)
      return setError("Password must contain at least 8 characters.");
    if (password !== confirmPassword)
      return setError("Passwords do not match.");
    if (!accessToken.current)
      return setError("This password reset link is invalid or has expired.");
    setError("");
    setIsSubmitting(true);
    try {
      await resetPassword(accessToken.current, password);
      setSuccess(true);
      window.history.replaceState(null, "", "/reset-password");
    } catch (resetError) {
      setError(
        resetError instanceof Error
          ? resetError.message
          : "Unable to reset password.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f2f0ea] px-4">
      <section className="w-full max-w-md rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="text-4xl text-[#141518]">Reset password</h1>
        {success ? (
          <div className="mt-6">
            <p className="text-green-700">
              Your password has been updated successfully.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-block text-[#6b1fa8] hover:underline"
            >
              Continue to login
            </Link>
          </div>
        ) : (
          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((shown) => !shown)}
                  className="absolute inset-y-0 right-0 cursor-pointer px-3 text-gray-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#6b1fa8] text-white hover:bg-[#5a1a8f]"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        )}
      </section>
    </main>
  );
}
