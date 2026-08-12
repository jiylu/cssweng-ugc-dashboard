import { useState } from "react";
import { useRouter } from "next/navigation";
import { clientOnboardingSchema } from "../schemas/client-onboarding.schema";
import type { ClientOnboardingForm } from "../types/client-onboarding.types";

type UseClientOnboardingOptions = {
  initialEmail?: string;
  proposalId?: string;
  campaignId?: string;
  onSubmit?: (form: ClientOnboardingForm) => Promise<void>;
  redirectAfterSubmit?: boolean;
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
  onSubmit,
  redirectAfterSubmit = true,
}: UseClientOnboardingOptions = {}) {
  const router = useRouter();
  const [form, setForm] = useState<ClientOnboardingForm>(
    getInitialForm(initialEmail),
  );
  const [errors, setErrors] = useState<ClientOnboardingForm>(getInitialForm());
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const updateEmailFromAccount = (email: string) => {
    setForm((prev) => ({
      ...prev,
      companyEmail: email,
      billingEmail: email,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    setSubmitError("");

    try {
      setIsSubmitting(true);
      await onSubmit?.(result.data);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to create account.",
      );
      return;
    } finally {
      setIsSubmitting(false);
    }

    window.sessionStorage.setItem(
      "clientOnboardingDetails",
      JSON.stringify(result.data),
    );

    if (!redirectAfterSubmit) return;

    const reviewId = proposalId ?? campaignId;
    router.push(reviewId ? `/proposals/${reviewId}` : "/proposals/preview");
  };

  return {
    form,
    errors,
    isSubmitting,
    submitError,
    handleChange,
    handleSubmit,
    updateEmailFromAccount,
  };
}
