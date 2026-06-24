import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/src/features/auth/services/users-api";
import { validateRegisterFields } from "../utils/validators";

export function useRegister() {
  const [form, setForm] = useState({ fname: "", lname: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ fname: "", lname: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const { mutate: register, isPending, error, isSuccess } = useMutation({
    mutationFn: () => createUser({
      email: form.email,
      password: form.password,
      firstName: form.fname,
      lastName: form.lname,
      role: "CREATOR",
    }),
    onSuccess: () => {
      window.setTimeout(() => router.push("/login"), 700);
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