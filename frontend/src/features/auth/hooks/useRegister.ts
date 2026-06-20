import { createUser } from "@/src/features/auth/services/users-api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { validateRegisterFields } from "../utils/validators";



export function useRegister() {
  const [form, setForm] = useState({ fname: "", lname: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ fname: "", lname: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (submitError) {
      setSubmitError("");
    }

    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    const newErrors = validateRegisterFields(form);

    if (newErrors.fname || newErrors.lname || newErrors.email || newErrors.password || newErrors.confirmPassword) {
      setErrors(newErrors);
      return;
    }

    setErrors(newErrors);
    setIsSubmitting(true);

    try {
      await createUser({
        email: form.email,
        password: form.password,
        firstName: form.fname,
        lastName: form.lname,
        role: "CREATOR",
      });

      setSubmitSuccess("Account created. Taking you to login...");
      window.setTimeout(() => router.push('/login'), 700);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to create account.");
      setIsSubmitting(false);
    }
  };

  return {
    errors,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    submitSuccess,
    isSubmitting,
    handleChange,
    handleSubmit,
    form,
    submitError,
  }
}