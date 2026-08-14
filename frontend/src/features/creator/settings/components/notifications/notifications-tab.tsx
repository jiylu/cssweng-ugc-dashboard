import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getAccountSettings,
  updateAccountSettings,
  type UpdateAccountSettings,
} from "../../services/settings-api"

interface NotificationsTabProps {
  isClient?: boolean
}

export function NotificationsTab({ isClient = false }: NotificationsTabProps) {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ["account-settings"],
    queryFn: getAccountSettings,
  })
  const mutation = useMutation({
    mutationFn: (payload: UpdateAccountSettings) => updateAccountSettings(payload),
    onSuccess: (settings) => {
      queryClient.setQueryData(["account-settings"], settings)
      toast.success("Notification preference updated.")
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Unable to update notifications."),
  })

  const disabled = isLoading || mutation.isPending

  return (
    <div className="bg-white border rounded-lg p-8 shadow-sm">
        <h2 className="text-2xl font-normal text-[#141518] mb-4">
            Email Notifications
        </h2> 
        <Separator />


        <div className="flex flex-col">
            {/* proposal activity */}
            <div className="flex items-center justify-between py-6">
                <div className="space-y-1 pr-8">
                    <h3 className="text-[18px] font-bold text-[#141518]">
                        {isClient ? "Campaign Updates" : "Proposal Activity"}
                    </h3>
                    <p className="text-[14px] text-gray-500">
                        {isClient
                            ? "Email me when a creator updates a campaign proposal or setup."
                            : "Email me when a client views, accepts, or requests revisions on a proposal."}
                    </p>
                </div>

                <Switch 
                    disabled={disabled}
                    checked={data?.email_proposal_updates ?? true}
                    onCheckedChange={(checked) =>
                      mutation.mutate({ emailProposalUpdates: checked })
                    }
                    className="data-[state=checked]:bg-[#6b1fa8]"
                />
            </div>
        
            <Separator />

            {/* contract signatures */}
            <div className="flex items-center justify-between py-6">
                <div className="space-y-1 pr-8">
                    <h3 className="text-[18px] font-bold text-[#141518]">Contract Signatures</h3>
                    <p className="text-[14px] text-gray-500">
                        {isClient
                            ? "Email me when a creator signs a contract and it is fully executed."
                            : "Email me when a contract is fully signed by both parties."}
                    </p>
                </div>

                <Switch 
                    disabled={disabled}
                    checked={data?.email_contract_updates ?? true}
                    onCheckedChange={(checked) =>
                      mutation.mutate({ emailContractUpdates: checked })
                    }
                    className="data-[state=checked]:bg-[#6b1fa8]"
                />
            </div>

            <Separator />

            {/* campaign milestones */}
            <div className="flex items-center justify-between py-6">
                <div className="space-y-1 pr-8">
                    <h3 className="text-[18px] font-bold text-[#141518]">
                        {isClient ? "Deliverable Submissions" : "Campaign Feedback"}
                    </h3>
                    <p className="text-[14px] text-gray-500">
                        {isClient
                            ? "Email me when a creator submits a deliverable for review."
                            : "Email me when a deliverable is approved or feedback is given in the workspace."}
                    </p>
                </div>

                <Switch 
                    disabled={disabled}
                    checked={data?.email_deliverable_updates ?? true}
                    onCheckedChange={(checked) =>
                      mutation.mutate({ emailDeliverableUpdates: checked })
                    }
                    className="data-[state=checked]:bg-[#6b1fa8]"
                />
            </div>

            <Separator />

            {/* deadlines and payments */}
            <div className="flex items-center justify-between pt-6">
                <div className="space-y-1 pr-8">
                    <h3 className="text-[18px] font-bold text-[#141518]">
                        {isClient ? "Payment Updates" : "Deadlines and Payments"}
                    </h3>
                    <p className="text-[14px] text-gray-500">
                        {isClient
                            ? "Email me when a submitted payment is validated."
                            : "Email me for approaching deliverable deadlines or unpaid invoices."}
                    </p>
                </div>

                <Switch 
                    disabled={disabled}
                    checked={data?.email_payment_updates ?? true}
                    onCheckedChange={(checked) =>
                      mutation.mutate({ emailPaymentUpdates: checked })
                    }
                    className="data-[state=checked]:bg-[#6b1fa8]"
                />
            </div>
      </div>
    </div>
  )
}
