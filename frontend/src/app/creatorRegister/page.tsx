"use client"

import Image from 'next/image';
import logo from './../public/Logo.svg'
import logo2 from './../public/Logo-notext-lime.svg'
import styles from '.././ui/loginRegisterStyles/login.module.css';

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
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'

export default function Register() {
  const router = useRouter()
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
              <h2>Everything you need,<br /><span className="text-[#AAFB79]">in one place.</span></h2>
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
                  <form>
                    <Field orientation="horizontal" className="mb-4 w-full flex gap-2">
                      <Button type="button" className="w-[50%]">Content Creator</Button>
                      <Button type="submit" variant="outline" className="w-[50%]">Client/Company</Button>
                    </Field>
                    {/* FULL NAME */}
                    <FieldGroup className="grid w-full grid-cols-2 mb-4">
                      <Field>
                        <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                        <Input id="first-name" placeholder="Carlos" />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                        <Input id="last-name" placeholder="Barring" />
                      </Field>
                    </FieldGroup>

                    {/* EMAIL */}
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
                        <Input
                          id="fieldgroup-email"
                          type="email"
                          placeholder="carlosBarring@example.com"
                        />
                        <FieldDescription>
                          Choose a unique e-mail for your account.
                        </FieldDescription>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="fieldgroup-password">Password</FieldLabel>
                        <Input
                          id="fieldgroup-password"
                          type="password"
                          placeholder="Enter a valid password"
                        />
                        <FieldDescription> 
                          Password must contain at least 8 characters, 
                          one uppercase letter (A–Z),
                          one lowercase letter (a–z),
                          one number (0–9), and
                          one special character (!@#$%^&*)</FieldDescription>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="fieldgroup-password">Confirm Password</FieldLabel>
                        <Input
                          id="fieldgroup-confirm-password"
                          type="password"
                          placeholder="Confirm password"
                        />
                      </Field>
                    </FieldGroup>

                    {/* Submit Button */}
                    <CardFooter className="flex-col gap-2">
                      <Button type="submit" className="w-full" onClick={() => router.push('/')}>
                        Create Account
                      </Button>
                      <CardDescription className="cursor-pointer hover:underline" onClick={() => router.push('/')}>
                            Alredy have an account?
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
