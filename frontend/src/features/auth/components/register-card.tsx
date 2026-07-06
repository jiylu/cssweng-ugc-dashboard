import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Button from "@/src/components/atoms/button";
import { CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRegister } from "../hooks/useRegister";
import { useRouter } from "next/navigation";

export interface RegisterCardProps {
  registerForm: ReturnType<typeof useRegister>
}

export default function RegisterCard({ registerForm }: RegisterCardProps) {
  const router = useRouter()
  
  return (
    <div className="w-full flex flex-col justify-center items-center box-border">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Fill out all the required fields to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* START OF FORM */}
          <form
            onSubmit={registerForm.handleSubmit}
            aria-busy={registerForm.isSubmitting}
          >
            {/* FULL NAME */}
            <FieldGroup className="grid w-full grid-cols-2 mb-4">
              <Field>
                <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                <Input
                  id="fname"
                  placeholder="Carlos"
                  value={registerForm.form.fname}
                  onChange={registerForm.handleChange}
                  disabled={registerForm.isSubmitting}
                />
                {registerForm.errors.fname && (
                  <p role="alert" className="text-[#ff6467] text-sm">
                    {registerForm.errors.fname}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                <Input
                  id="lname"
                  placeholder="Barring"
                  value={registerForm.form.lname}
                  onChange={registerForm.handleChange}
                  disabled={registerForm.isSubmitting}
                />
                {registerForm.errors.lname && (
                  <p role="alert" className="text-[#ff6467] text-sm">
                    {registerForm.errors.lname}
                  </p>
                )}
              </Field>
            </FieldGroup>

            {/* EMAIL */}
            <Field className="mb-3">
              <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="carlosBarring@example.com"
                value={registerForm.form.email}
                onChange={registerForm.handleChange}
                disabled={registerForm.isSubmitting}
              />
              {registerForm.errors.email ? (
                <p role="alert" className="text-[#ff6467] text-sm">
                  {registerForm.errors.email}
                </p>
              ) : (
                <FieldDescription>Choose a unique e-mail for your account.</FieldDescription>
              )}
            </Field>

            {/* PASSWORD */}
            <FieldGroup className="grid w-full grid-cols-2 mb-4">
              {/* PASSWORD */}
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={registerForm.showPassword ? "text" : "password"}
                    placeholder="Enter a valid password"
                    value={registerForm.form.password}
                    onChange={registerForm.handleChange}
                    disabled={registerForm.isSubmitting}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    // size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground hover:bg-transparent"
                    onClick={() => registerForm.setShowPassword(prev => !prev)}
                    disabled={registerForm.isSubmitting}
                    aria-label={registerForm.showPassword ? "Hide password" : "Show password"}
                  >
                    {registerForm.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {registerForm.errors.password && (
                  <p role="alert" className="text-[#ff6467] text-sm">
                    {registerForm.errors.password}
                  </p>
                )}
              </Field>

              {/* CONFIRM PASSWORD */}
              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={registerForm.showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={registerForm.form.confirmPassword}
                    onChange={registerForm.handleChange}
                    disabled={registerForm.isSubmitting}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    // size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground hover:bg-transparent"
                    onClick={() => registerForm.setShowConfirmPassword(prev => !prev)}
                    disabled={registerForm.isSubmitting}
                    aria-label={registerForm.showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {registerForm.showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {registerForm.errors.confirmPassword && (
                  <p role="alert" className="text-[#ff6467] text-sm">
                    {registerForm.errors.confirmPassword}
                  </p>
                )}
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
              {registerForm.submitError && (
                <p role="alert" className="text-[#ff6467] text-sm">
                  {registerForm.submitError}
                </p>
              )}
              {registerForm.submitSuccess && (
                <p className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="size-4" />
                  {registerForm.submitSuccess}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <CardFooter className="flex-col gap-2">
              <Button
                type="submit"
                className="w-full"
                disabled={registerForm.isSubmitting}
              >
                {registerForm.isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {registerForm.isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
              <CardDescription
                className="cursor-pointer hover:underline"
                onClick={() => !registerForm.isSubmitting && router.push('/login')}
              >
                Already have an account?
              </CardDescription>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}