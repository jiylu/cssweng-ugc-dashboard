import { Button } from "@/components/ui/button"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getAccountSettings, updateAccountSettings } from "../../services/settings-api"

export function TwoFactorAuth() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ["account-settings"],
    queryFn: getAccountSettings,
  })
  const mutation = useMutation({
    mutationFn: (enabled: boolean) =>
      updateAccountSettings({ twoFactorEnabled: enabled }),
    onSuccess: (settings) => {
      queryClient.setQueryData(["account-settings"], settings)
      toast.success(
        settings.two_factor_enabled
          ? "Two-factor authentication enabled."
          : "Two-factor authentication disabled.",
      )
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Unable to update 2FA."),
  })

  const enabled = data?.two_factor_enabled ?? false

  return (
    <div className="bg-white border rounded-lg p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div>
        <h2 className="text-[22px] font-normal text-[#141518] mb-2">Two-Factor Authentication (2FA)</h2>
        <p className="text-[15px] text-gray-500">Add an extra layer of security to your account</p>
      </div>
      <Button
        variant="outline"
        className="px-8 py-5 text-[15px] font-normal text-[#141518] border-gray-300"
        disabled={isLoading || mutation.isPending}
        onClick={() => mutation.mutate(!enabled)}
      >
        <span className="mt-1">
          {mutation.isPending ? "SAVING..." : enabled ? "DISABLE" : "ENABLE"}
        </span>
        </Button>
    </div>
  )
}
