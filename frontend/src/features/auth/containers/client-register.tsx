"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import ClientOnboardingCard from "../components/client-onboarding-card";
import ClientRegisterCard from "../components/client-register-card";
import { useClientOnboarding } from "../hooks/useClientOnboarding";
import { useRegister } from "../hooks/useRegister";
import { clientRegisterParamsSchema } from "../schemas/client-register-params.schema";
import OtpCard from "../components/otp-card";

export default function ClientRegister() {
  const [step, setStep] = useState<"account" | "onboarding">("account");
  const searchParams = useSearchParams();
  const params = clientRegisterParamsSchema.parse({
    email: searchParams.get("email") ?? undefined,
    proposalId: searchParams.get("proposalId") ?? undefined,
    campaignId: searchParams.get("campaignId") ?? undefined,
  });
  const onboardingForm = useClientOnboarding({
    initialEmail: params.email,
    proposalId: params.proposalId,
    campaignId: params.campaignId,
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
    <main className="h-screen overflow-hidden bg-[#f2f0ea]">
      <div className="fixed inset-0 bg-black/65" />
      <div className="relative flex h-screen flex-col px-8 py-6 max-md:px-4 max-md:py-4">
        <Image
          src="/Logo-black.svg"
          alt="Asceoft"
          width={120}
          height={40}
          className="h-auto w-[120px]"
          priority
        />

        <section className="mx-auto mt-4 flex w-full max-w-[880px] flex-1 flex-col items-center overflow-hidden rounded border border-[#d8d4cb] bg-[#f2f0ea] px-8 py-5 max-md:mt-4 max-md:px-4">
          <h1 className="text-center text-[38px] leading-none text-[#6b1fa8] max-md:text-3xl">
            {step === "account" ? "Client Registration" : "Onboarding"}
          </h1>

          <div className="mt-5 w-full">
            {step === "account" && registerForm.step === "details" ? (
              <ClientRegisterCard registerForm={registerForm} />
            ) : step === "account" ? (
              <OtpCard registerForm={registerForm} />
            ) : (
              <ClientOnboardingCard onboardingForm={onboardingForm} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
