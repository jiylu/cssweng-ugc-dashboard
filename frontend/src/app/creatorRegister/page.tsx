"use client"
// Local
import Image from 'next/image';
import logo from './../public/Logo.svg'
import logo2 from './../public/Logo-notext-purple.svg'
import styles from '.././ui/loginRegisterStyles/login.module.css';
import { CheckCircle2, Loader2 } from "lucide-react";

// React
import { useRouter } from 'next/navigation'
import { useState } from "react";
import { createUser } from "@/lib/users-api";

// Shadecn
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function Register() {
  const [form, setForm] = useState({ fname:"", lname:"", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ fname:"", lname:"", email: "", password: "", confirmPassword: "" });
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

  // VALIDATIONS
  const validate = () => {
    const newErrors = { fname:"", lname:"", email: "", password: "", confirmPassword: "" };

    // First name
    if (!form.fname) {
      newErrors.fname = "First name is required.";
    } else if (form.fname.length < 2) {
      newErrors.fname = "First name must atleast be 2 characters.";
    }

    // Last name
    if (!form.lname) {
      newErrors.lname = "Last name is required.";
    } else if (form.lname.length < 2) {
      newErrors.lname = "Last name must atleast be 2 characters.";
    }

    // Email
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Password & Confirm Password
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6 || form.password.length > 20) {
      newErrors.password = "Password must be at least 6-20 characters";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(form.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter.';
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = 'Password must contain at least one number.';
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(form.password)) {
      newErrors.password = 'Password must contain at least one special character (!@#$%^&*).';
    } else if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    const newErrors = validate();

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

  return (
    <>
      <title>Register</title>
      <main>
        <section className={styles.overlay} >
          {/* LEFT PANEL */}
          <div className={styles.leftpanel}>
            <div className={styles.gridlines} />
            <div className={styles.orb1} />
            <div className={styles.orb2} />

            <Image src={logo} alt="Logo" className="w-[200px] mb-10"/>

            <div className={styles.herotext}>
              <h2>Everything you need,<br /><span className="text-[#8811FF]">in one place.</span></h2>
              <p>Manage your content, track analytics,<br />and collaborate with clients.</p>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className={styles.loginpanel} >
            <Image src={logo2} alt="Logo2" className="w-[50px]"/>
            <h1 className={styles.h1text}>Become A Creator,</h1>
            <div className={styles.cardwrapper}>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Create your account</CardTitle>
                  <CardDescription>
                    Fill out all the required fields to create an account.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* START OF FORM */}
                  <form onSubmit={handleSubmit} aria-busy={isSubmitting}>
                    {/* FULL NAME */}
                    <FieldGroup className="grid w-full grid-cols-2 mb-4">
                      <Field>
                        <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                        <Input id="fname" placeholder="Carlos" value={form.fname} onChange={handleChange} disabled={isSubmitting}/>
                        {errors.fname && <p role="alert" style={{ color: "#ff6467" }}>{errors.fname}</p>}
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                        <Input id="lname" placeholder="Barring" value={form.lname} onChange={handleChange} disabled={isSubmitting}/>
                        {errors.lname && <p role="alert" style={{ color: "#ff6467" }}>{errors.lname}</p>}
                      </Field>
                    </FieldGroup>

                    {/* EMAIL */}
                    <Field className="mb-3">
                      <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        placeholder="carlosBarring@example.com"
                        value={form.email}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                      {errors.email 
                        ? <p role="alert" style={{ color: "#ff6467" }}>{errors.email}</p>
                        : <FieldDescription>Choose a unique e-mail for your account.</FieldDescription>
                      }
                    </Field>
                    
                    {/* PASSWORD */}
                    <FieldGroup className="grid w-full grid-cols-2 mb-4">
                      {/* PASSWORD */}
                      <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter a valid password"
                            value={form.password}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground hover:bg-transparent"
                            onClick={() => setShowPassword(prev => !prev)}
                            disabled={isSubmitting}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {errors.password && <p role="alert" style={{ color: "#ff6467" }}>{errors.password}</p>}
                      </Field>

                      {/* CONFIRM PASSWORD */}
                      <Field>
                        <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                            disabled={isSubmitting}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {errors.confirmPassword && <p role="alert" style={{ color: "#ff6467" }}>{errors.confirmPassword}</p>}
                      </Field>
                    </FieldGroup>
                    <FieldDescription> 
                      Password must contain at least 6 characters, 
                      one uppercase letter (A–Z),
                      one lowercase letter (a–z),
                      one number (0–9), and
                      one special character (!@#$%^&*)
                    </FieldDescription>
                    <div aria-live="polite" className="min-h-6">
                      {submitError && <p role="alert" style={{ color: "#ff6467" }}>{submitError}</p>}
                      {submitSuccess && (
                        <p className="flex items-center gap-2 text-sm text-[#168a3a]">
                          <CheckCircle2 className="size-4" />
                          {submitSuccess}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <CardFooter className="flex-col gap-2">
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                      </Button>
                      <CardDescription className="cursor-pointer hover:underline" onClick={() => !isSubmitting && router.push('/')}>
                            Already have an account?
                      </CardDescription>
                    </CardFooter>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
