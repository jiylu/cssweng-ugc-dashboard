"use client"
import CreatorProposalsNavigation from "../components/proposals-nav";
import CreatorSidebar from "../../../../components/organisms/creator-sidebar";
import { useCampaignForm } from "../hooks/useCampaignForm";
import CampaignDetailsSection from "@/src/features/creator/proposals/components/campaign-details/campaign-details-form";
import ClientDetailsForm from "@/src/features/creator/proposals/components/client-details/client-details-form";
import { Separator } from "@/components/ui/separator";
import DeliverablesForm from "@/src/features/creator/proposals/components/deliverables/deliverables-form";
import Button from "@/src/components/atoms/button";
import { SendHorizontal } from "lucide-react";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { useCreateCampaign } from "@/src/features/creator/proposals/hooks/useCreateCampaignMutation";
import { toast } from "sonner";
import { CreateCampaignPayload } from "@/src/features/creator/proposals/types/campaign-setup.types";
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ProposalProgressBar } from "@/src/features/creator/proposals/components/proposal-progress-bar";

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
            <ProposalProgressBar activeStep={1} />
          </div>

          {/* Campaign Details + Client Info */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <CampaignDetailsSection form={form} />
            <ClientDetailsForm
              contactEmail={form.contactEmail}
              setContactEmail={form.setContactEmail}
              errors={form.errors}
            />
          </div>

          {/* Deliverables */}
          <DeliverablesForm
            deliverables={form.deliverables}
            errors={form.errors}
            addDeliverable={form.addDeliverable}
            removeDeliverable={form.removeDeliverable}
            updateDeliverable={form.updateDeliverable}
            adjustPrice={form.adjustPrice}
          />

          {/* Bottom Actions */}
          <div className="flex justify-end gap-3 mt-6 pb-8">
            <Button variant="outline" onClick={handleSaveDraft} disabled={isPending}>
              Save Draft
            </Button>
            <Button
              onClick={handleSendProposal}
              disabled={isPending}
              className="bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white flex items-center gap-2"
            >
              Contract Terms <SendHorizontal size={16} />
            </Button>
          </div>

        </div>
      </section>
    </main>
  )
}