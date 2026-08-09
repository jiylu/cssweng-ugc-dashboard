import { useState } from "react";
import { useRouter } from "next/navigation";
import { clientOnboardingSchema } from "../schemas/client-onboarding.schema";
import type { ClientOnboardingForm } from "../types/client-onboarding.types";

type UseClientOnboardingOptions = {
  initialEmail?: string;
  proposalId?: string;
  campaignId?: string;
};

const getInitialForm = (initialEmail = ""): ClientOnboardingForm => ({
  companyLegalName: "",
  companyEmail: initialEmail,
  companyAddress: "",
  companyPhoneNumber: "",
  contactPerson: "",
  contactNumber: "",
  billablePerson: "",
  billingEmail: initialEmail,
});

export function useClientOnboarding({
  initialEmail = "",
  proposalId,
  campaignId,
}: UseClientOnboardingOptions = {}) {
  const router = useRouter();
  const [form, setForm] = useState<ClientOnboardingForm>(
    getInitialForm(initialEmail),
  );
  const [errors, setErrors] = useState<ClientOnboardingForm>(getInitialForm());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const updateEmailFromAccount = (email: string) => {
    setForm((prev) => ({
      ...prev,
      companyEmail: prev.companyEmail || email,
      billingEmail: prev.billingEmail || email,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = clientOnboardingSchema.safeParse(form);

    if (!result.success) {
      const newErrors = getInitialForm();

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ClientOnboardingForm | undefined;

        if (field) {
          newErrors[field] = issue.message;
        }
      });

      setErrors(newErrors);
      return;
    }

    setErrors(getInitialForm());
    window.sessionStorage.setItem(
      "clientOnboardingDetails",
      JSON.stringify(result.data),
    );

    const reviewId = proposalId ?? campaignId;
    router.push(reviewId ? `/proposals/${reviewId}` : "/proposals/preview");
  };

  return {
    form,
    errors,
    handleChange,
    handleSubmit,
    updateEmailFromAccount,
  };
}
