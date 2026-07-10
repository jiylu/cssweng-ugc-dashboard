"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import ClientOnboardingCard from "../components/client-onboarding-card";
import ClientRegisterCard from "../components/client-register-card";
import { useClientOnboarding } from "../hooks/useClientOnboarding";
import { useRegister } from "../hooks/useRegister";
import { clientRegisterParamsSchema } from "../schemas/client-register-params.schema";

export default function ClientRegister() {
  const [step, setStep] = useState<"account" | "onboarding">("account");
  const searchParams = useSearchParams();
  const params = clientRegisterParamsSchema.parse({
    email: searchParams.get("email") ?? undefined,
    proposalId: searchParams.get("proposalId") ?? undefined,
  });
  const onboardingForm = useClientOnboarding({
    initialEmail: params.email,
    proposalId: params.proposalId,
  });
  const registerForm = useRegister({
    initialEmail: params.email,
    onSuccess: (accountForm) => {
      onboardingForm.updateEmailFromAccount(accountForm.email);
      setStep("onboarding");
    },
    role: "CLIENT",
  });

  return (
    <main className="min-h-screen bg-[#f2f0ea]">
      <div className="fixed inset-0 bg-black/65" />
      <div className="relative min-h-screen px-10 py-9 max-md:px-4">
        <Image
          src="/Logo-black.svg"
          alt="Asceoft"
          width={140}
          height={40}
          className="h-auto w-[140px]"
          priority
        />

        <section className="mx-auto mt-10 flex min-h-[calc(100vh-120px)] w-full max-w-[1000px] flex-col items-center rounded border border-[#d8d4cb] bg-[#f2f0ea] px-12 py-10 max-md:mt-8 max-md:min-h-0 max-md:px-4">
          <h1 className="text-center text-[48px] leading-none text-[#6b1fa8] max-md:text-4xl">
            {step === "account" ? "Client Registration" : "Onboarding"}
          </h1>

          <div className="mt-8 w-full">
            {step === "account" ? (
              <ClientRegisterCard registerForm={registerForm} />
            ) : (
              <ClientOnboardingCard onboardingForm={onboardingForm} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
