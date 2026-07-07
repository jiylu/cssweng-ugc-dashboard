import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "@/src/features/auth/services/users-api";
import { LoginForm } from "../types/login-types";
import { validateLoginFields } from "../utils/validators";
import { getAuthenticatedHomeRoute } from "../utils/auth-routes";

export function useLogin() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<LoginForm>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: login, isPending, error, isSuccess } = useMutation({
    // PROD: Keep credentials included so the backend can set the HttpOnly auth cookie; do not store access tokens in frontend storage for security
    mutationFn: () => loginUser({ ...form, rememberMe }),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(["auth-user"], user);
      router.replace(getAuthenticatedHomeRoute(user));
    },
  });

  const updateField = (field: "email" | "password", value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateLoginFields(form);
    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }
    setErrors(newErrors);
    login();
  };

  return {
    form,
    errors,
    showPassword,
    rememberMe,
    isSubmitting: isPending,
    submitError: error instanceof Error ? error.message : error ? "Unable to login." : "",
    submitSuccess: isSuccess ? "Login successful. Taking you to your dashboard..." : "",
    updateField,
    togglePasswordVisibility,
    setRememberMe,
    handleSubmit,
    setShowPassword,
  };
}
