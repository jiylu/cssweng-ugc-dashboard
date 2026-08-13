"use client"
import { ArrowRight, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import CampaignDetailsSection from "@/src/features/creator/proposals/components/campaign-details/campaign-details-form";
import ClientDetailsForm from "@/src/features/creator/proposals/components/client-details/client-details-form";
import DeliverablesForm from "@/src/features/creator/proposals/components/deliverables/deliverables-form";
import { useCampaignForm } from "@/src/features/creator/proposals/hooks/useCampaignForm"

interface CampaignDeliverablesContainerProps {
    form: ReturnType<typeof useCampaignForm>
    onNext: () => void
}

export function CampaignDeliverablesContainer({ form, onNext }: CampaignDeliverablesContainerProps) {
  return (
    <>
        <div className="grid grid-cols-2 gap-6 mb-6">
            <CampaignDetailsSection form={form} />
            <ClientDetailsForm
                contactPerson={form.contactPerson}
                setContactPerson={form.setContactPerson}
                contactEmail={form.contactEmail}
                setContactEmail={form.setContactEmail}
                errors={form.errors}
            />
        </div>

        <DeliverablesForm
            deliverables={form.deliverables}
            campaignStartDate={form.startDate}
            campaignEndDate={form.endDate}
            currency={form.currency}
            errors={form.errors}
            platformOptions={form.platforms.map((entry) => entry.platform)}
            addDeliverable={form.addDeliverable}
            removeDeliverable={form.removeDeliverable}
            updateDeliverable={form.updateDeliverable}
        />

        <div className="flex justify-end gap-3 mt-6 pb-8">
            <Button
                variant="outline"
                className="flex items-center gap-2 p-5"
            >
                <Save size={16} className="-mt-1" /> Save Draft
            </Button>
            <Button
                onClick={() => {
                    const isValid = form.validateForm()
                    if (isValid) onNext()
                }}
                className="bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white flex items-center gap-2 p-5"
            >
                Contract Terms  <ArrowRight size={16} />
            </Button>
        </div>
    </>
  )
}
