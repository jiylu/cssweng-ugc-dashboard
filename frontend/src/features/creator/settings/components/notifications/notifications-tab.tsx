import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export function NotificationsTab() {
  // state for toggles
  const [proposalUpdates1, setProposalUpdates1] = useState(true)
  const [proposalUpdates2, setProposalUpdates2] = useState(true)
  const [campaignMilestones, setCampaignMilestones] = useState(true)
  const [overdueAlerts, setOverdueAlerts] = useState(true)

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
                    <h3 className="text-[18px] font-bold text-[#141518]">Proposal Activity</h3>
                    <p className="text-[14px] text-gray-500">
                        Email me when a client views, accepts, or requests revisions on a proposal.
                    </p>
                </div>

                <Switch 
                    checked={proposalUpdates1} 
                    onCheckedChange={setProposalUpdates1} 
                    className="data-[state=checked]:bg-[#6b1fa8]"
                />
            </div>
        
            <Separator />

            {/* contract signatures */}
            <div className="flex items-center justify-between py-6">
                <div className="space-y-1 pr-8">
                    <h3 className="text-[18px] font-bold text-[#141518]">Contract Signatures</h3>
                    <p className="text-[14px] text-gray-500">
                        Email me when a contract is fully signed by both parties.
                    </p>
                </div>

                <Switch 
                    checked={proposalUpdates2} 
                    onCheckedChange={setProposalUpdates2} 
                    className="data-[state=checked]:bg-[#6b1fa8]"
                />
            </div>

            <Separator />

            {/* campaign milestones */}
            <div className="flex items-center justify-between py-6">
                <div className="space-y-1 pr-8">
                    <h3 className="text-[18px] font-bold text-[#141518]">Campaign Feedback</h3>
                    <p className="text-[14px] text-gray-500">
                        Email me when a deliverable is approved or feedback is given in the workspace.
                    </p>
                </div>

                <Switch 
                    checked={campaignMilestones} 
                    onCheckedChange={setCampaignMilestones} 
                    className="data-[state=checked]:bg-[#6b1fa8]"
                />
            </div>

            <Separator />

            {/* deadlines and payments */}
            <div className="flex items-center justify-between pt-6">
                <div className="space-y-1 pr-8">
                    <h3 className="text-[18px] font-bold text-[#141518]">Deadlines and Payments</h3>
                    <p className="text-[14px] text-gray-500">
                        Email me for approaching deliverable deadlines or unpaid invoices.
                    </p>
                </div>

                <Switch 
                    checked={overdueAlerts} 
                    onCheckedChange={setOverdueAlerts} 
                    className="data-[state=checked]:bg-[#6b1fa8]"
                />
            </div>
      </div>
    </div>
  )
}