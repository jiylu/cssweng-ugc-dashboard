"use client"

import { FormEvent, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { changePassword } from "../../services/settings-api"

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/

export function PasswordAndSecurity() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

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
      <form className="space-y-8 max-w-4xl" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground uppercase">Current Password</label>
          <Input type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="border-muted" />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground uppercase">New Password</label>
          <Input type="password" autoComplete="new-password" required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="border-muted" />
          <p className="text-[13px] text-gray-500 pt-1">Requirements: At least 8 characters, one uppercase letters (A-Z), one lowercase letter, one number (0-9), and one special character (!@#$%^&*)</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground uppercase">Confirm Password</label>
          <Input type="password" autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="border-muted" />
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Updating password..." : "Update Password"}</Button>
      </form>
    </div>
  )
}
