import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function PasswordAndSecurity() {
  return (
    <div className="bg-white border rounded-lg p-8 shadow-sm">
      <h2 className="text-2xl font-normal text-[#141518] mb-4">Password & Security</h2>
      <Separator className="mb-6" />
      <div className="space-y-8 max-w-4xl">
        <div className="space-y-2">
          <label className="text-sm text-[#141518] uppercase">Current Password</label>
          <Input type="password" disabled placeholder="Not yet available" />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-[#141518] uppercase">New Password</label>
          <Input type="password" disabled placeholder="Not yet available" />
          <p className="text-[13px] text-gray-500 pt-1">Requirements: At least 8 characters, one uppercase letters (A-Z), one lowercase letter, one number (0-9), and one special character (!@#$%^&*)</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-[#141518] uppercase">Confirm Password</label>
          <Input type="password" disabled placeholder="Not yet available" />
        </div>
      </div>
    </div>
  )
}
