import { loginSchema } from "../schemas/login.schema";
import { registerSchema } from "../schemas/register.schema";
import { LoginForm } from "../types/login-types";
import { RegisterForm } from "../types/register-types";

export function validateLoginFields(form: LoginForm): LoginForm {
  const newErrors: LoginForm = { email: "", password: "" };
  const result = loginSchema.safeParse(form);

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof LoginForm;
      if (field && !newErrors[field]) {
        newErrors[field] = issue.message;
      }
    }
  }

  return newErrors;
}

export function validateRegisterFields(form: RegisterForm): RegisterForm {
  const newErrors: RegisterForm = { fname: "", lname: "", email: "", password: "", confirmPassword: "" };
  const result = registerSchema.safeParse(form);

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof RegisterForm;
      if (field && !newErrors[field]) {
        newErrors[field] = issue.message;
      }
    }
  }

  return newErrors;
}