"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import ClientOnboardingCard from "../components/client-onboarding-card";
import ClientRegisterCard from "../components/client-register-card";
import { useClientOnboarding } from "../hooks/useClientOnboarding";
import { useRegister } from "../hooks/useRegister";
import { clientRegisterParamsSchema } from "../schemas/client-register-params.schema";
import OtpCard from "../components/otp-card";
import { assignClientToCampaign } from "../services/users-api";

export default function ClientRegister() {
  const [step, setStep] = useState<"account" | "onboarding" | "otp">("account");
  const createdClientId = useRef<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = clientRegisterParamsSchema.parse({
    email: searchParams.get("email") ?? undefined,
    proposalId: searchParams.get("proposalId") ?? undefined,
    campaignId: searchParams.get("campaignId") ?? undefined,
  });
  const registerForm = useRegister({
    initialEmail: params.email,
    onDetailsSuccess: (accountForm) => {
      onboardingForm.updateEmailFromAccount(accountForm.email);
      setStep("onboarding");
    },
    onVerificationSuccess: async (_accountForm, verificationToken) => {
      if (!createdClientId.current) {
        const details = onboardingForm.form;
        const user = await registerForm.completeClientRegistration(
          {
            companyLegalName: details.companyLegalName,
            companyEmail: details.companyEmail,
            billablePerson: details.billablePerson,
            contactPerson: details.contactPerson,
            companyContactNumber: Number(
              details.companyPhoneNumber.replace(/\D/g, ""),
            ),
            contactPersonContactNumber: Number(
              details.contactNumber.replace(/\D/g, ""),
            ),
          },
          verificationToken,
        );
        createdClientId.current = user.user_id;
      }

      if (params.campaignId) {
        await assignClientToCampaign(params.campaignId, createdClientId.current);
      }

      const reviewId = params.proposalId ?? params.campaignId;
      router.push(reviewId ? `/proposals/${reviewId}` : "/proposals/preview");
    },
    onChangeEmail: () => {
      createdClientId.current = null;
      setStep("account");
    },
    role: "CLIENT",
    deferRegistrationUntilClientDetails: true,
    deferOtpUntilAfterDetails: true,
  });
  const onboardingForm = useClientOnboarding({
    initialEmail: params.email,
    proposalId: params.proposalId,
    campaignId: params.campaignId,
    redirectAfterSubmit: false,
    onSubmit: async () => {
      await registerForm.requestOtp();
      setStep("otp");
    },
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
            {step === "account"
              ? "Client Registration"
              : step === "onboarding"
                ? "Onboarding"
                : "Verify It’s You"}
          </h1>

          <div className="mt-5 w-full">
            {step === "account" ? (
              <ClientRegisterCard registerForm={registerForm} />
            ) : step === "otp" ? (
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
