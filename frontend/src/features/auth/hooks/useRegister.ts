import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createUser, requestRegistrationOtp, validateRegistrationOtp, type CreateClientPayload, type CreateUserPayload } from "@/src/features/auth/services/users-api";
import { validateRegisterFields } from "../utils/validators";
import type { RegisterForm } from "../types/register-types";

type UseRegisterOptions = {
  initialEmail?: string;
  onSuccess?: (form: RegisterForm) => void;
  onDetailsSuccess?: (form: RegisterForm) => void;
  onVerificationSuccess?: (form: RegisterForm, verificationToken: string) => Promise<void> | void;
  onChangeEmail?: () => void;
  redirectTo?: string;
  role?: CreateUserPayload["role"];
  deferRegistrationUntilClientDetails?: boolean;
  deferOtpUntilAfterDetails?: boolean;
};

const getInitialForm = (initialEmail = ""): RegisterForm => ({
  fname: "",
  lname: "",
  email: initialEmail,
  password: "",
  confirmPassword: "",
});

export function useRegister({
  initialEmail = "",
  onSuccess,
  onDetailsSuccess,
  onVerificationSuccess,
  onChangeEmail,
  redirectTo = "/login",
  role = "CREATOR",
  deferRegistrationUntilClientDetails = false,
  deferOtpUntilAfterDetails = false,
}: UseRegisterOptions = {}) {
  const [form, setForm] = useState<RegisterForm>(getInitialForm(initialEmail));
  const [errors, setErrors] = useState<RegisterForm>(getInitialForm());
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<"details" | "otp">("details");
  const [otp, setOtp] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const router = useRouter();

  const { mutate: sendOtp, mutateAsync: requestOtp, isPending: isSendingOtp, error: sendOtpError } = useMutation({
    mutationFn: () => requestRegistrationOtp({ email: form.email, role }),
    onSuccess: () => setStep("otp"),
  });

  const { mutate: verifyAndRegister, isPending: isVerifying, error: verificationError, isSuccess: isVerificationSuccess } = useMutation({
    mutationFn: async () => {
      const result = verificationToken
        ? { verificationToken }
        : await validateRegistrationOtp({ email: form.email, role, otp });
      if (!verificationToken) setVerificationToken(result.verificationToken);

      if (deferRegistrationUntilClientDetails) {
        await onVerificationSuccess?.(form, result.verificationToken);
        return;
      }
  
      const userDTO: CreateUserPayload = {
        email: form.email,
        password: form.password,
        firstName: form.fname,
        lastName: form.lname,
        role,
        verificationToken: result.verificationToken,
      };

      return createUser(userDTO);
    },
    onSuccess: () => {
      if (deferRegistrationUntilClientDetails) return;

      if (onSuccess) {
        onSuccess(form);
        return;
      }
      window.setTimeout(() => router.push(redirectTo), 700);
    },
  });

  const {
    mutateAsync: completeClientRegistration,
    isPending: isCompletingRegistration,
    error: registrationError,
    isSuccess,
  } = useMutation({
    mutationFn: ({ clientDTO, token }: { clientDTO: CreateClientPayload; token?: string }) => {
      const registrationToken = token ?? verificationToken;
      if (!registrationToken) {
        throw new Error("Verify your email before completing registration.");
      }

      return createUser(
        {
          email: form.email,
          password: form.password,
          firstName: form.fname,
          lastName: form.lname,
          role,
          verificationToken: registrationToken,
        },
        clientDTO,
      );
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateRegisterFields(form);
    if (newErrors.fname || newErrors.lname || newErrors.email || newErrors.password || newErrors.confirmPassword) {
      setErrors(newErrors);
      return;
    }
    setErrors(newErrors);
    if (deferOtpUntilAfterDetails) {
      onDetailsSuccess?.(form);
      return;
    }
    sendOtp();
  };

  const handleOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^\d{8}$/.test(otp)) return;
    verifyAndRegister();
  };

  return {
    form,
    errors,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    step,
    otp,
    setOtp,
    setStep,
    handleOtpSubmit,
    resendOtp: sendOtp,
    requestOtp,
    returnToDetails: () => {
      setStep("details");
      setOtp("");
      setVerificationToken("");
      onChangeEmail?.();
    },
    completeClientRegistration: (clientDTO: CreateClientPayload, token?: string) =>
      completeClientRegistration({ clientDTO, token }),
    isSubmitting: isSendingOtp || isVerifying || isCompletingRegistration,
    submitError: (verificationError instanceof Error ? verificationError.message : verificationError ? "Unable to create account." : "") || (registrationError instanceof Error ? registrationError.message : "") || (sendOtpError instanceof Error ? sendOtpError.message : ""),
    submitSuccess: (deferRegistrationUntilClientDetails ? isSuccess : isVerificationSuccess) ? "Account created. Taking you to login..." : "",
    handleChange,
    handleSubmit,
  };
}
