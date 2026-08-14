"use client"
import { useEffect, useRef } from "react"
import CreatorProposalsNavigation from "@/src/features/creator/proposals/components/proposals-nav";
import CreatorSidebar from "@/src/components/organisms/creator-sidebar";
import { useCampaignForm } from "../hooks/useCampaignForm";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { useCreateCampaign } from "@/src/features/creator/proposals/hooks/useCreateCampaignMutation";
import { useCreateDraft, useDeleteDraft, useDraft, useUpdateDraft } from "@/src/features/creator/proposals/hooks/useProposalDrafts";
import { useSubmittedProposalDetails } from "@/src/features/creator/proposals/hooks/useSubmittedProposalDetails";
import { useUpdateCampaignSetup } from "@/src/features/creator/proposals/hooks/useUpdateCampaignSetup";
import { applyDraftToForm } from "@/src/features/creator/proposals/utils/applyDraftToForm";
import { applyCampaignSetupToForm, LoadedSetupIds } from "@/src/features/creator/proposals/utils/applyCampaignSetupToForm";
import { buildUpdateCampaignPayload } from "@/src/features/creator/proposals/utils/buildUpdateCampaignPayload";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { ProposalProgressBar } from "@/src/features/creator/proposals/components/proposal-progress-bar";
import { CampaignDeliverablesContainer } from "@/src/features/creator/proposals/containers/campaign-deliverables-container";
import { ContractTermsContainer } from "@/src/features/creator/proposals/containers/contract-terms-container";
import { PaymentTermsContainer } from "@/src/features/creator/proposals/containers/payment-terms-container";
import { AddOnsContainer } from "@/src/features/creator/proposals/containers/add-ons-container";
import { ProposalSummaryContainer } from "@/src/features/creator/proposals/containers/proposal-summary-container"
import { buildProposalPayload } from "@/src/features/creator/proposals/utils/buildProposalPayload"
import { buildDraftPayload } from "@/src/features/creator/proposals/utils/buildDraftPayload"
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
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const contractTerms = useContractTerms()
  const paymentTerms = usePaymentTerms()
  const addOns = useAddOns()
  const draftId = searchParams.get("draft")
  const editCampaignId = searchParams.get("edit")
  const isEditing = !!editCampaignId
  const { mutate: saveNewDraft, isPending: isSavingNewDraft } = useCreateDraft()
  const { mutate: saveExistingDraft, isPending: isSavingExistingDraft } = useUpdateDraft(draftId ?? undefined)
  const { mutate: deleteDraft } = useDeleteDraft()
  const { data: draft, isLoading: draftLoading } = useDraft(draftId ?? undefined)
  const { data: setupDetails, isLoading: setupLoading } = useSubmittedProposalDetails(editCampaignId ?? undefined)
  const { mutate: updateCampaign, isPending: isUpdating } = useUpdateCampaignSetup()
  const loadedIdsRef = useRef<LoadedSetupIds | null>(null)
  const isSavingDraft = isSavingNewDraft || isSavingExistingDraft
  const baseCreatorFee = calculateBaseCreatorFee(
    form.deliverables,
    [],
    contractTerms.exclusivityFee,
    contractTerms.hasExclusivity,
    paymentTerms.giftedProducts
  )

  useEffect(() => {
    if (draft && user) {
      applyDraftToForm({ form, contractTerms, paymentTerms, addOns, draft })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, user])

  useEffect(() => {
    if (setupDetails && user) {
      const ids = applyCampaignSetupToForm({ form, contractTerms, paymentTerms, addOns, details: setupDetails })
      loadedIdsRef.current = ids
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setupDetails, user])

  useEffect(() => {
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = true
    }

    window.addEventListener("beforeunload", warnBeforeLeaving)
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving)
  }, [])

  if (loading) return <LogoLoader label="Loading proposal form" />;

  if (!user) return null;

  if (draftLoading || (isEditing && (setupLoading || !setupDetails))) return <LogoLoader label="Loading proposal details" />;

  const buildPayload = () => buildProposalPayload({
    userId: user.user_id,
    form,
    contractTerms,
    paymentTerms,
    addOns,
  })

  const handleSaveDraft = () => {
    if (isEditing) {
      toast.info("Draft saving is not available while editing a submitted proposal.");
      return;
    }

    const draftPayload = buildDraftPayload({
      userId: user.user_id,
      form,
      contractTerms,
      paymentTerms,
      addOns,
    });

    if (draftId) {
      saveExistingDraft(draftPayload, {
        onSuccess: () => {
          toast.success("Draft saved!");
          router.push('/proposals/drafts');
        },
        onError: (err) => toast.error(err.message),
      });
      return;
    }

    saveNewDraft(
      draftPayload,
      {
        onSuccess: (data) => {
          toast.success("Draft saved!");
          queryClient.setQueryData(["draft", data.public_id], data);
          router.push('/proposals/drafts');
        },
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

    if (isEditing) {
      if (!editCampaignId || !loadedIdsRef.current) return;
      updateCampaign(
        {
          campaignPublicId: editCampaignId,
          payload: buildUpdateCampaignPayload({ form, contractTerms, paymentTerms, addOns, loadedIds: loadedIdsRef.current }),
        },
        {
          onSuccess: () => {
            toast.success("Proposal updated!");
            queryClient.invalidateQueries({ queryKey: ["submitted-proposals", user.user_id] });
            queryClient.invalidateQueries({ queryKey: ["proposal-client", editCampaignId] });
            queryClient.invalidateQueries({ queryKey: ["submitted-proposal-details", editCampaignId] });
            router.push('/proposals/submitted');
          },
          onError: (err) => toast.error(err.message),
        }
      );
      return;
    }

    submitCampaign(
      { payload: buildPayload() },
      {
        onSuccess: () => {
          toast.success("Proposal sent!");
          if (draftId) {
            deleteDraft(draftId);
          }
          router.push('/proposals/submitted');
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
            activeTab="create"
            userFirstName={user.first_name}
            userLastName={user.last_name}
            userEmail={user.email}
          />
          <Separator />

          {/* HEADER */}
          <div className="mt-5 mb-5">
            <h1 className="text-[44px] font-normal">
              {isEditing ? "Edit Proposal" : "Create New Proposal"}
            </h1>
            <p className="text-[18px] text-muted-foreground">
              {isEditing
                ? "Update the proposal and resubmit it to your client for review."
                : "Draft a proposal for your next client collaboration. Ensure all deliverables are clearly defined."}
            </p>
          </div>

          <Separator className="-mt-2 mb-5"/>

          {/* Progress Bar */}
          <div className="justify-center">
            <ProposalProgressBar
              activeStep={form.activeStep}
              onStepChange={form.setActiveStep}
              onValidateStep={(step) => {
                if (step === 1) return form.validateForm()
                if (step === 2) return contractTerms.validateForm({ startDate: form.startDate, endDate: form.endDate })
                if (step === 3) return addOns.validateForm()
                if (step === 4) return paymentTerms.validateForm()
                return true
              }}
            />
          </div>

          {/* Step 1 - Campaign & Deliverables */}
          {form.activeStep === 1 && (
            <CampaignDeliverablesContainer
              form={form}
              readOnly={isEditing}
              onNext={() => form.setActiveStep(2)}
              onSaveDraft={handleSaveDraft}
            />
          )}

          {/* Step 2 - Contract Terms */}
          {form.activeStep === 2 && (
            <ContractTermsContainer
              contractTerms={contractTerms}
              currency={form.currency}
              campaignDates={{ startDate: form.startDate, endDate: form.endDate }}
              onBack={() => form.setActiveStep(1)}
              onNext={() => form.setActiveStep(3)}
              onSaveDraft={handleSaveDraft}
            />
          )}
          
          {/* Step 3 - Add-ons */}
          {form.activeStep === 3 && (
            <AddOnsContainer
              addOns={addOns}
              currency={form.currency}
              onBack={() => form.setActiveStep(2)}
              onNext={() => form.setActiveStep(4)}
              onSaveDraft={handleSaveDraft}
            />
          )}

          {/* Step 4 - Payment Terms */}
          {form.activeStep === 4 && (
            <PaymentTermsContainer
              paymentTerms={paymentTerms}
              onBack={() => form.setActiveStep(3)}
              onNext={() => form.setActiveStep(5)}
              onSaveDraft={handleSaveDraft}
              onSubmit={handleSendProposal}
              isPending={isEditing ? isUpdating : isPending}
              baseCreatorFee={baseCreatorFee}
              currency={form.currency}
              taxRate={paymentTerms.taxRate}
            />  
          )}

          {/* Step 5 - Review & Submit */}
          {form.activeStep === 5 && (
            <ProposalSummaryContainer
              form={form}
              contractTerms={contractTerms}
              addOns={addOns}
              paymentTerms={paymentTerms}
              userName={`${user.first_name} ${user.last_name}`}
              onBack={() => form.setActiveStep(4)}
              onSaveDraft={handleSaveDraft}
              onSubmit={handleSendProposal}
              isPending={isEditing ? isUpdating : isPending}
              isSavingDraft={isSavingDraft}
            />
          )}
        </div>
      </section>
    </main>
  )

}
