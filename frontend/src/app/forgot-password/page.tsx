"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/src/components/atoms/button";
import { requestPasswordReset } from "@/src/features/auth/services/auth-session";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);
    try {
      const result = await requestPasswordReset(email);
      setMessage(result.message);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to request a reset link.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f2f0ea] px-4">
      <section className="w-full max-w-md rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="text-4xl text-[#141518]">Forgot password?</h1>
        <p className="mt-3 text-sm text-[#6f6a63]">
          Enter your account email and we’ll send you a password reset link.
        </p>
        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          {message && (
            <p role="status" className="text-sm text-green-700">
              {message}
            </p>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#6b1fa8] text-white hover:bg-[#5a1a8f]"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
        <Link
          href="/login"
          className="mt-5 block text-center text-sm text-[#6b1fa8] hover:underline"
        >
          Back to login
        </Link>
      </section>
    </main>
  );
}
