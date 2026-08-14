"use client"

import { FormEvent, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"
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

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
          <div className="relative">
            <Input
              type={showCurrentPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="border-muted pr-10"
            />
            <button
              type="button"
              className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
            >
              {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground uppercase">New Password</label>
          <div className="relative">
            <Input
              type={showNewPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="border-muted pr-10"
            />
            <button
              type="button"
              className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowNewPassword((prev) => !prev)}
              aria-label={showNewPassword ? "Hide new password" : "Show new password"}
            >
              {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <p className="text-[13px] text-gray-500 pt-1">Requirements: At least 8 characters, one uppercase letters (A-Z), one lowercase letter, one number (0-9), and one special character (!@#$%^&*)</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground uppercase">Confirm Password</label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="border-muted pr-10"
            />
            <button
              type="button"
              className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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
