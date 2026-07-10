"use client"
import CreatorProposalsNavigation from "@/src/features/creator/proposals/components/proposals-nav";
import CreatorSidebar from "@/src/components/organisms/creator-sidebar";
import { useCampaignForm } from "../hooks/useCampaignForm";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { useCreateCampaign } from "@/src/features/creator/proposals/hooks/useCreateCampaignMutation";
import { toast } from "sonner";
import { CreateCampaignPayload } from "@/src/features/creator/proposals/types/campaign-setup.types";
import { useRouter } from "next/navigation"
import { ProposalProgressBar } from "@/src/features/creator/proposals/components/proposal-progress-bar";
import { CampaignDeliverablesContainer } from "@/src/features/creator/proposals/containers/campaign-deliverables-container";
import { ContractTermsContainer } from "@/src/features/creator/proposals/containers/contract-terms-container";
import { PaymentTermsContainer } from "@/src/features/creator/proposals/containers/payment-terms-container";
import { AddOnsContainer } from "@/src/features/creator/proposals/containers/add-ons-container";
import { buildProposalPayload } from "@/src/features/creator/proposals/utils/buildProposalPayload"
import { useContractTerms } from "@/src/features/creator/proposals/hooks/useContractTerms"
import { usePaymentTerms } from "@/src/features/creator/proposals/hooks/usePaymentTerms"
import { useAddOns } from "@/src/features/creator/proposals/hooks/useAddOns"
import { calculateBaseCreatorFee } from "@/src/features/creator/proposals/utils/calculateTotalFee"
import LogoLoader from "@/src/components/molecules/logo-loader";

export default function CreateCampaign() {
  const form = useCampaignForm();
  const { user, loading } = useAuth();
  const { mutate: submitCampaign, isPending } = useCreateCampaign();
  const router = useRouter();
  const contractTerms = useContractTerms()
  const paymentTerms = usePaymentTerms()
  const addOns = useAddOns()
  const baseCreatorFee = calculateBaseCreatorFee(
    form.deliverables,
    addOns.addOns,
    contractTerms.exclusivityFee,
    contractTerms.hasExclusivity,
    paymentTerms.giftedProducts
  )

  if (loading) return <LogoLoader label="Loading proposal form" />;

  if (!user) return null;

  const buildPayload = () => buildProposalPayload({
    userId: user.user_id,
    form,
    contractTerms,
    paymentTerms,
    addOns,
  })

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
          <CreatorProposalsNavigation 
            userFirstName={user.first_name}
            userLastName={user.last_name}
            userEmail={user.email}
          />
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
            <CampaignDeliverablesContainer
              form={form}
              onNext={() => form.setActiveStep(2)}
            />
          )}

          {/* Step 2 - Contract Terms */}
          {form.activeStep === 2 && (
            <ContractTermsContainer
              contractTerms={contractTerms}
              onBack={() => form.setActiveStep(1)}
              onNext={() => form.setActiveStep(3)}
            />
          )}
          
          {/* Step 3 - Add-ons */}
          {form.activeStep === 3 && (
            <AddOnsContainer
              addOns={addOns}
              onBack={() => form.setActiveStep(2)}
              onNext={() => form.setActiveStep(4)}
            />
          )}

          {/* Step 4 - Payment Terms */}
          {form.activeStep === 4 && (
            <PaymentTermsContainer
              paymentTerms={paymentTerms}
              onBack={() => form.setActiveStep(3)}
              onSaveDraft={handleSaveDraft}
              onSubmit={handleSendProposal}
              isPending={isPending}
              baseCreatorFee={baseCreatorFee}
              currency={form.currency}
              taxRate={0.12}
            />  
          )}
        </div>
      </section>
    </main>
  )

}
