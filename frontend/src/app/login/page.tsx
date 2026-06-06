"use client"
// Local
import Image from 'next/image';
import logo from './../public/Logo.svg'
import logo2 from './../public/Logo-notext-lime.svg'
import styles from './../ui/loginRegisterStyles/login.module.css';

// React
import { useRouter } from 'next/navigation'
import { useState } from "react";

// Shadecn
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
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
  const router = useRouter()

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
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // console.log("Submit:", form); // CHECKER LANG
    router.push('/dashboard');
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
              <h2>Everything you need,<br /><span className="text-[#AAFB79]">in one place.</span></h2>
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
                  <form onSubmit={handleSubmit}>
                    {/* EMAIL INPUT */}
                    <div className="flex flex-col gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="text"
                          placeholder="email@example.com"
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                        {errors.email && <p style={{ color: "#ff6467" }}>{errors.email}</p>}
                      </div>

                    {/* PASSWORD INPUT */}
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label htmlFor="password">Password</Label>
                          <a
                            href="#"
                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                          >
                            Forgot your password?
                          </a>
                        </div>
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder=".........." 
                          value={form.password} 
                          onChange={e => setForm({ ...form, password: e.target.value })} 
                        />
                        {errors.password && <p style={{ color: "#ff6467" }}>{errors.password}</p>}
                      </div>

                    </div>
                      <CardFooter className="flex-col gap-2">
                        <Button type="submit" className="cursor-pointer w-full">
                          Login
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="cursor-pointer w-full" 
                          onClick={() => router.push('/contentCreatorRegister')}
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
