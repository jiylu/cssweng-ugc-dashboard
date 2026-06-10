"use client"
// Local
import logo from './../public/Logo.svg'
import logo2 from './../public/Logo-notext-purple.svg'
import styles from './../ui/loginRegisterStyles/login.module.css';
import { CheckCircle2, Loader2 } from "lucide-react";

// React
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { useState } from "react";
import { loginUser } from "@/lib/users-api";

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default function Page() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter()

  const updateField = (field: "email" | "password", value: string) => {
    if (submitError) {
      setSubmitError("");
    }

    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // VALIDATIONS
  const validate = () => {
    const newErrors = { email: "", password: "" };
    

    // Email
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Password
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6 || form.password.length > 20) {
      newErrors.password = "Password must be at least 6-20 characters";
    }

    return newErrors;
  };

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
      window.setTimeout(() => router.push('/creatorDashboard'), 500);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to login.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <title>Log-in</title>
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
            <h1 className={styles.h1text}>Welcome Back,</h1>
            <div className={styles.cardwrapper}>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Login to your account</CardTitle>
                  <CardDescription>
                    Enter your email below to login to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* --DITO START NG FORM-- */}
                  <form onSubmit={handleSubmit} aria-busy={isSubmitting}>
                    {/* EMAIL INPUT */}
                    <div className="flex flex-col gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="text"
                          placeholder="email@example.com"
                          value={form.email}
                          onChange={e => updateField("email", e.target.value)}
                          disabled={isSubmitting}
                        />
                        {errors.email && <p role="alert" style={{ color: "#ff6467" }}>{errors.email}</p>}
                      </div>

                    {/* PASSWORD INPUT */}
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label htmlFor="password">Password</Label>
                          
                          <a href="#"
                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                          >
                            Forgot your password?
                          </a>
                        </div>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder=".........."
                            value={form.password}
                            onChange={e => updateField("password", e.target.value)}
                            disabled={isSubmitting}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-transparent"
                            onClick={() => setShowPassword(prev => !prev)}
                            disabled={isSubmitting}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {errors.password && (
                          <p role="alert" style={{ color: "#ff6467" }}>{errors.password}</p>
                        )}
                      </div>
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          disabled={isSubmitting}
                          className="size-4 cursor-pointer accent-[#8811FF]"
                        />
                        Remember me for 30 days
                      </label>
                      <div aria-live="polite" className="min-h-6">
                        {submitError && <p role="alert" style={{ color: "#ff6467" }}>{submitError}</p>}
                        {submitSuccess && (
                          <p className="flex items-center gap-2 text-sm text-[#168a3a]">
                            <CheckCircle2 className="size-4" />
                            {submitSuccess}
                          </p>
                        )}
                      </div>

                    </div>
                      <CardFooter className="flex-col gap-2">
                        <Button type="submit" className="cursor-pointer w-full" disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                          {isSubmitting ? "Logging in..." : "Login"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="cursor-pointer w-full" 
                          onClick={() => router.push('/creatorRegister')}
                          disabled={isSubmitting}
                        >
                          Register
                      </Button>
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
