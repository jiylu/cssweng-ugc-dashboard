"use client"

import { FormEvent, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
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
      setError("")
      toast.success(message)
    },
    onError: (cause) =>
      setError(cause instanceof Error ? cause.message : "Unable to change password."),
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!PASSWORD_PATTERN.test(newPassword)) {
      setError("New password does not meet the password requirements.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.")
      return
    }
    if (currentPassword === newPassword) {
      setError("New password must be different from the current password.")
      return
    }
    setError("")
    mutation.mutate({ currentPassword, newPassword })
  }

  return (
    <div className="bg-white border rounded-lg p-8 shadow-sm">
      <h2 className="text-2xl font-normal text-[#141518] mb-4">Password & Security</h2>
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
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Updating password..." : "Update Password"}
        </Button>
      </form>
    </div>
  )
}
