"use client"

import { FormEvent, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { changePassword } from "../../services/settings-api"

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/

export function PasswordAndSecurity() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [visiblePasswords, setVisiblePasswords] = useState({ current: false, new: false, confirm: false })

  function toggleVisibility(field: keyof typeof visiblePasswords) {
    setVisiblePasswords((current) => ({ ...current, [field]: !current[field] }))
  }

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: ({ message }) => {
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setVisiblePasswords({ current: false, new: false, confirm: false })
      setError("")
      toast.success(message)
    },
    onError: (cause) => setError(cause instanceof Error ? cause.message : "Unable to change password."),
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!PASSWORD_PATTERN.test(newPassword)) return setError("New password does not meet the password requirements.")
    if (newPassword !== confirmPassword) return setError("New passwords do not match.")
    if (currentPassword === newPassword) return setError("New password must be different from the current password.")
    setError("")
    mutation.mutate({ currentPassword, newPassword })
  }

  const fields = [
    { id: "current-password", label: "Current Password", value: currentPassword, onChange: setCurrentPassword, visibility: "current" as const, autoComplete: "current-password" },
    { id: "new-password", label: "New Password", value: newPassword, onChange: setNewPassword, visibility: "new" as const, autoComplete: "new-password" },
    { id: "confirm-password", label: "Confirm Password", value: confirmPassword, onChange: setConfirmPassword, visibility: "confirm" as const, autoComplete: "new-password" },
  ]

  return (
    <div className="rounded-lg border bg-white p-8 shadow-sm">
      <h2 className="mb-4 text-2xl font-normal text-[#141518]">Password &amp; Security</h2>
      <Separator className="mb-6" />
      <form className="max-w-4xl space-y-8" onSubmit={handleSubmit}>
        {fields.map((field) => {
          const isVisible = visiblePasswords[field.visibility]
          return (
            <div key={field.id} className="space-y-2">
              <label htmlFor={field.id} className="text-sm uppercase text-muted-foreground">{field.label}</label>
              <div className="relative">
                <Input id={field.id} type={isVisible ? "text" : "password"} autoComplete={field.autoComplete} required value={field.value} onChange={(event) => field.onChange(event.target.value)} className="border-muted pr-11" />
                <button type="button" onClick={() => toggleVisibility(field.visibility)} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground" aria-label={`${isVisible ? "Hide" : "Show"} ${field.label.toLowerCase()}`}>
                  {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {field.visibility === "new" && (
                <p className="pt-1 text-[13px] text-gray-500">Requirements: At least 8 characters, one uppercase letter (A-Z), one lowercase letter, one number (0-9), and one special character (!@#$%^&amp;*)</p>
              )}
            </div>
          )
        })}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Updating password..." : "Update Password"}</Button>
      </form>
    </div>
  )
}
