import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createUser, type CreateUserPayload } from "@/src/features/auth/services/users-api";
import { validateRegisterFields } from "../utils/validators";
import type { RegisterForm } from "../types/register-types";

type UseRegisterOptions = {
  initialEmail?: string;
  onSuccess?: (form: RegisterForm) => void;
  redirectTo?: string;
  role?: CreateUserPayload["role"];
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
  redirectTo = "/login",
  role = "CREATOR",
}: UseRegisterOptions = {}) {
  const [form, setForm] = useState<RegisterForm>(getInitialForm(initialEmail));
  const [errors, setErrors] = useState<RegisterForm>(getInitialForm());
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const { mutate: register, isPending, error, isSuccess } = useMutation({
    mutationFn: () => createUser({
      email: form.email,
      password: form.password,
      firstName: form.fname,
      lastName: form.lname,
      role,
    }),
    onSuccess: () => {
      if (onSuccess) {
        onSuccess(form);
        return;
      }

      window.setTimeout(() => router.push(redirectTo), 700);
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
    register();
  };

  return {
    form,
    errors,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isSubmitting: isPending,
    submitError: error instanceof Error ? error.message : error ? "Unable to create account." : "",
    submitSuccess: isSuccess ? "Account created. Taking you to login..." : "",
    handleChange,
    handleSubmit,
  };
}
