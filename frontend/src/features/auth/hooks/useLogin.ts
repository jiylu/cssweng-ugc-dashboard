import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/users-api";
import { loginSchema } from "../schemas/login.schema";

type LoginForm = {
  email: string;
  password: string;
};

type LoginErrors = {
  email: string;
  password: string;
};

export function useLogin() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<LoginErrors>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const updateField = (field: "email" | "password", value: string) => {
    if (submitError) {
      setSubmitError("");
    }
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validate = (): LoginErrors => {
    const newErrors: LoginErrors = { email: "", password: "" };
    const result = loginSchema.safeParse(form);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginErrors;
        if (field && !newErrors[field]) {
          newErrors[field] = issue.message;
        }
      }
    }

    return newErrors;
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    const newErrors = validate();

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    setErrors(newErrors);
    setIsSubmitting(true);

    try {
      // PROD: Keep credentials included so the backend can set the HttpOnly auth cookie; do not store access tokens in frontend storage for security
      await loginUser({
        ...form,
        rememberMe,
      });
      setSubmitSuccess("Login successful. Taking you to your dashboard...");
      window.setTimeout(() => router.push("/creator-dashboard"), 500);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to login.");
      setIsSubmitting(false);
    }
  };

  return {
    form,
    errors,
    showPassword,
    submitError,
    submitSuccess,
    rememberMe,
    isSubmitting,
    updateField,
    togglePasswordVisibility,
    setRememberMe,
    handleSubmit,
    setShowPassword,
  };
}