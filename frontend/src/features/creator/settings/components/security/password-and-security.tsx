"use client"

import { FormEvent, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { changePassword } from "../../services/settings-api"

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/

export function PasswordAndSecurity() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [visiblePasswords, setVisiblePasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  function toggleVisibility(field: keyof typeof visiblePasswords) {
    setVisiblePasswords((current) => ({
      ...current,
      [field]: !current[field],
    }))
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
          <label htmlFor="current-password" className="text-sm text-muted-foreground uppercase">Current Password</label>
          <div className="relative">
            <Input id="current-password" type={visiblePasswords.current ? "text" : "password"} autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="border-muted pr-11" />
            <button type="button" onClick={() => toggleVisibility("current")} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground" aria-label={visiblePasswords.current ? "Hide current password" : "Show current password"}>
              {visiblePasswords.current ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="new-password" className="text-sm text-muted-foreground uppercase">New Password</label>
          <div className="relative">
            <Input id="new-password" type={visiblePasswords.new ? "text" : "password"} autoComplete="new-password" required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="border-muted pr-11" />
            <button type="button" onClick={() => toggleVisibility("new")} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground" aria-label={visiblePasswords.new ? "Hide new password" : "Show new password"}>
              {visiblePasswords.new ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <p className="text-[13px] text-gray-500 pt-1">Requirements: At least 8 characters, one uppercase letters (A-Z), one lowercase letter, one number (0-9), and one special character (!@#$%^&*)</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirm-password" className="text-sm text-muted-foreground uppercase">Confirm Password</label>
          <div className="relative">
            <Input id="confirm-password" type={visiblePasswords.confirm ? "text" : "password"} autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="border-muted pr-11" />
            <button type="button" onClick={() => toggleVisibility("confirm")} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground" aria-label={visiblePasswords.confirm ? "Hide confirmation password" : "Show confirmation password"}>
              {visiblePasswords.confirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Updating password..." : "Update Password"}
        </Button>
      </form>
    </div>
  )
}
