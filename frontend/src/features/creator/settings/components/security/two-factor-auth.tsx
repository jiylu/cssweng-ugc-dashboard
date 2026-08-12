import { Button } from "@/components/ui/button"

export function TwoFactorAuth() {
  return (
    <div className="bg-white border rounded-lg p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div>
        <h2 className="text-[22px] font-normal text-[#141518] mb-2">Two-Factor Authentication (2FA)</h2>
        <p className="text-[15px] text-gray-500">Add an extra layer of security to your account</p>
      </div>
      <Button disabled variant="outline" className="px-8 py-5 text-[15px] font-normal text-[#141518] border-gray-300">
        <span className="mt-1">ENABLE</span>
        </Button>
    </div>
  )
}
