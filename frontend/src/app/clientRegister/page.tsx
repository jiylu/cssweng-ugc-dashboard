"use client"
// Local
import Image from 'next/image';
import logo from './../public/Logo.svg'
import logo2 from './../public/Logo-notext-lime.svg'
import styles from '.././ui/loginRegisterStyles/login.module.css';

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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function Register() {
  const [form, setForm] = useState({ companyName:"", address:"", email: "", taxid: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ companyName:"", address:"", email: "", taxid: "", password: "", confirmPassword: "" });
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // VALIDATIONS
  const validate = () => {
    const newErrors = { companyName:"", address:"", email: "", taxid: "", password: "", confirmPassword: "" };

    // Company name
    if (!form.companyName) {
      newErrors.companyName = "First name is required.";
    } else if (form.companyName.length < 2) {
      newErrors.companyName = "First name must atleast be 2 characters.";
    }

    // Email
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Address
    if (!form.address) {
      newErrors.address = "Address is required.";
    }

    // TIN
    if (!form.taxid) {
      newErrors.taxid = "Tax Identification Number is required.";
    }

    // Password & Confirm Password
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(form.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter.';
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = 'Password must contain at least one number.';
    } else if (!/[!@#$%^&*]/.test(form.password)) {
      newErrors.password = 'Password must contain at least one special character (!@#$%^&*).';
    } else if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validate();

    if (newErrors.companyName ||  newErrors.address || newErrors.email || newErrors.taxid || newErrors.password || newErrors.confirmPassword) {
      setErrors(newErrors);
      return;
    }

    // console.log("Submit:", form); // CHECKER LANG
    router.push('/login');
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
                  <form onSubmit={handleSubmit}>
                    <Field orientation="horizontal" className="mb-4 w-full flex gap-2">
                      <Button type="button" variant="outline" className="w-[50%]" onClick={() => router.push('/creatorRegister')}>Content Creator</Button>
                      <Button type="button" className="w-[50%]" onClick={() => router.push('/clientregister')}>Client/Company</Button>
                    </Field>
                    {/* COMPANY NAME */}
                    <FieldGroup className="grid w-full grid-cols-2 mb-4">
                      <Field>
                        <FieldLabel htmlFor="company-name">Company Name</FieldLabel>
                        <Input id="companyName" placeholder="Enter a comapany name" value={form.companyName} onChange={handleChange}/>
                        {errors.companyName && <p style={{ color: "#ff6467" }}>{errors.companyName}</p>}
                      </Field>
                        {/* ADDRESS */}
                      <Field>
                        <FieldLabel htmlFor="fieldgroup-address">Address</FieldLabel>
                        <Input
                        id="address"
                        type="text"
                        placeholder="Enter a valid company address"
                        value={form.address}
                        onChange={handleChange}
                        />
                        {errors.address && <p style={{ color: "#ff6467" }}>{errors.address}</p>}
                      </Field>
                    </FieldGroup>

                    {/* TAX IDENTIFICATION NUMBER */}
                    <Field className="mb-4">
                        <FieldLabel htmlFor="tax-id">Tax Identification Number (TIN)</FieldLabel>
                        <Input id="taxid" type="number" placeholder="Enter TIN number" value={form.taxid} onChange={handleChange}/>
                        {errors.taxid && <p style={{ color: "#ff6467" }}>{errors.taxid}</p>}
                    </Field>

                    {/* EMAIL */}
                    <Field className="mb-3">
                      <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        placeholder="company@example.com"
                        value={form.email}
                        onChange={handleChange}
                      />
                      {errors.email 
                        ? <p style={{ color: "#ff6467" }}>{errors.email}</p>
                        : <FieldDescription>Choose a unique e-mail for your account.</FieldDescription>
                      }
                    </Field>

                    <FieldGroup className="grid w-full grid-cols-2 mb-4">
                      {/* PASSWORD */}
                      <Field>
                        <FieldLabel htmlFor="fieldgroup-password">Password</FieldLabel>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter a valid password"
                          value={form.password}
                          onChange={handleChange}
                        />
                        {errors.password && <p style={{ color: "#ff6467" }}>{errors.password}</p>}
                      </Field>
            
                      {/* CONFIM PASSWORD */}
                      <Field>
                        <FieldLabel htmlFor="fieldgroup-password">Confirm Password</FieldLabel>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm password"
                          value={form.confirmPassword}
                          onChange={handleChange}
                        />
                        {errors.confirmPassword && <p style={{ color: "#ff6467" }}>{errors.confirmPassword}</p>}
                      </Field>
                    </FieldGroup>
                    <FieldDescription> 
                      Password must contain at least 6 characters, 
                      one uppercase letter (A–Z),
                      one lowercase letter (a–z),
                      one number (0–9), and
                      one special character (!@#$%^&*)
                    </FieldDescription>

                    {/* Submit Button */}
                    <CardFooter className="flex-col gap-2">
                      <Button type="submit" className="w-full">
                        Create Account
                      </Button>
                      <CardDescription className="cursor-pointer hover:underline" onClick={() => router.push('/')}>
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
