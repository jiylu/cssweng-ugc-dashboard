"use client"
import CreatorProposalsNavigation from "@/src/features/creator/proposals/components/proposals-nav";
import CreatorSidebar from "@/src/components/organisms/creator-sidebar";
import { useCampaignForm } from "../hooks/useCampaignForm";
import CampaignDetailsSection from "@/src/features/creator/proposals/components/campaign-details/campaign-details-form";
import ClientDetailsForm from "@/src/features/creator/proposals/components/client-details/client-details-form";
import { Separator } from "@/components/ui/separator";
import DeliverablesForm from "@/src/features/creator/proposals/components/deliverables/deliverables-form";
import Button from "@/src/components/atoms/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { useCreateCampaign } from "@/src/features/creator/proposals/hooks/useCreateCampaignMutation";
import { toast } from "sonner";
import { CreateCampaignPayload } from "@/src/features/creator/proposals/types/campaign-setup.types";
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ProposalProgressBar } from "@/src/features/creator/proposals/components/proposal-progress-bar";
import AddOnsForm from "../components/add-ons/add-ons-form";
import { ContractTermsContainer } from "@/src/features/creator/proposals/containers/contract-terms-container";
import { PaymentTermsContainer } from "@/src/features/creator/proposals/containers/payment-terms-container";

export default function CreateCampaign() {
  const form = useCampaignForm();
  const { user, loading } = useAuth();
  const { mutate: submitCampaign, isPending } = useCreateCampaign();
  const router = useRouter();

  if (loading) return (
    <div className="flex mt-5 justify-center">
      <Badge variant="outline">
        <Spinner data-icon="inline-start" />
        Loading...
      </Badge>
    </div>
  );

  if (!user) return null;

  const buildPayload = (): CreateCampaignPayload => ({
    campaign: {
      ugcId: user.user_id,
      projectName: form.projectName,
      description: form.campaignDescription,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      platforms: form.platforms
    },
    deliverables: form.deliverables.map(({ ...rest }) => ({
      deliverableTitle: rest.deliverableTitle,
      description: rest.description,
      deliverableType: rest.deliverableType as 'COLLABORATION' | 'UGC',
      deadline: new Date(rest.draftDeadline).toISOString(),
      pricing: parseFloat(rest.pricing.replace(/,/g, '') || '0'),
    })),
    proposal: {
      clientEmail: form.contactEmail,
    },
  });

  const handleSaveDraft = () => {
    if (!form.validateForm()) {
      const allErrors = Object.entries(form.errors)
        .map(([field, err]) => {
          const message = (err as { message?: string })?.message || err || "Invalid input";
          return `${field}: ${message}`;
        })
        .join(", ");
      if (allErrors) {
        toast.error(allErrors);
      }
      return;
    };
    submitCampaign(
      { payload: buildPayload() },
      {
        onSuccess: () => toast.success("Draft saved!"),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleSendProposal = () => {
    if (!form.validateForm()) {
      const allErrors = Object.entries(form.errors)
        .map(([field, err]) => {
          const message = (err as { message?: string })?.message || err || "Invalid input";
          return `${field}: ${message}`;
        })
        .join(", ");
      if (allErrors) {
        toast.error(allErrors);
      }
      return;
    };
    submitCampaign(
      { payload: buildPayload() },
      {
        onSuccess: () => {
          toast.success("Proposal sent!");
          router.push('/creator-dashboard');
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <main className="flex flex-row w-full h-screen overflow-hidden">
      <CreatorSidebar />
      <section className="flex-1 h-screen overflow-y-scroll scrollbar-gutter-stable">
        <div className="p-7.5 w-full max-w-300 m-auto text-[#141518]">
          <CreatorProposalsNavigation />
          <Separator />

          {/* HEADER */}
          <div className="mt-5 mb-5">
            <h1 className="text-[44px] font-normal">
              Create New Proposal
            </h1>
            <p className="text-[18px] text-muted-foreground">
              Draft a proposal for your next client collaboration. Ensure all deliverables are clearly defined.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="justify-center">
            <ProposalProgressBar
              activeStep={form.activeStep} 
              onStepChange={form.setActiveStep}
            />
          </div>

          {/* Step 1 - Campaign & Deliverables */}
          {form.activeStep === 1 && (
            <>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <CampaignDetailsSection form={form} />
                <ClientDetailsForm
                  contactEmail={form.contactEmail}
                  setContactEmail={form.setContactEmail}
                  errors={form.errors}
                />
              </div>

              <DeliverablesForm
                deliverables={form.deliverables}
                errors={form.errors}
                addDeliverable={form.addDeliverable}
                removeDeliverable={form.removeDeliverable}
                updateDeliverable={form.updateDeliverable}
              />

              <div className="flex justify-end gap-3 mt-6 pb-8">
                {/* <Button variant="outline" onClick={handleSaveDraft} disabled={isPending}>
                  Save Draft
                </Button> */}
                <Button
                  onClick={() => {
                    if (form.validateForm()) form.setActiveStep(2)
                  }}
                  className="bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white flex items-center gap-2"
                >
                  Contract Terms  <ArrowRight size={16} />
                </Button>
              </div>
            </>
          )}

          {/* Step 2 - Contract Terms */}
          {form.activeStep === 2 && (
            <ContractTermsContainer
              onBack={() => form.setActiveStep(1)}
              onNext={() => form.setActiveStep(3)}
            />
          )}
          
          {/* Step 3 - Add-ons */}
          {form.activeStep === 3 && (
            <>
              <div className="mt-6">
                <AddOnsForm
                  currency="PHP" // HARD CODED PA
                  addOns={[]} // NO DATA YET
                  onAddCustom={() => console.log("Clicked add custom button")}
                  onRemove={(id) => console.log("Removed ", id)}
                  onAdjustPrice={(id, amount) => console.log("Adjusted price for", id, amount)}
                />
              </div>

              {/* Bottom Actions */}
              <div className="flex justify-between mt-6 pb-8">
                <Button variant="outline" onClick={() => form.setActiveStep(2)}>
                  Back
                </Button>
                <Button
                  onClick={() => form.setActiveStep(4)}
                  className="bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white flex items-center gap-2"
                >
                  Payment Terms <ArrowRight size={16} />
                </Button>
              </div>
            </>
          )}

          {/* Step 4 - Payment Terms */}
          {form.activeStep === 4 && (
            <PaymentTermsContainer
              onBack={() => form.setActiveStep(3)}
              onNext={() => form.setActiveStep(4)}
              onSaveDraft={handleSaveDraft}
              onSubmit={handleSendProposal}
              isPending={isPending}
            />  
          )}
        </div>
      </section>
    </main>
  )
}