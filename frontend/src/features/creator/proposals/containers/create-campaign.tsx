import { useRef } from "react";
import CreatorProposalsNavigation from "../components/proposals-nav";
import CreatorSidebar from "../../dashboard/components/creator-sidebar";
import { useCampaignForm } from "../hooks/useCampaignForm";
import CampaignDetailsSection from "../components/campaign-details-form";
import ClientDetailsForm from "../components/client-details-form";
import { Separator } from "@/components/ui/separator";
import DeliverablesForm from "../components/deliverables-form";
import Button from "@/src/components/atoms/button";
import { SendHorizontal } from "lucide-react";
import { useAuth } from "@/src/app/hooks/useAuth";
import { useCreateCampaign } from "../hooks/useCreateCampaignMutation";
import { toast } from "sonner";
import { CreateCampaignPayload } from "../types/campaign-setup.types";
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

export default function CreateCampaign() {
  const form = useCampaignForm();
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
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
      deliverableTitle: rest.deliverable_title,
      description: rest.description,
      deliverableType: rest.deliverable_type as 'COLLABORATION' | 'UGC',
      deadline: new Date(rest.deadline).toISOString(),
      pricing: parseFloat(rest.pricing.replace(/,/g, '') || '0'),
    })),
    proposal: {
      clientEmail: form.contactEmail,
    },
  });

  const handleSaveDraft = () => {
    if (!form.validateForm()) {
        // todo: make the format presentable
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
        // todo: make the format presentable
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
            <h1 className="text-[44px] text-weight">
              Create New Proposal
            </h1>
            <p className="text-[18px] text-muted-foreground">
              Draft a proposal for your next client collaboration. Ensure all deliverables are clearly defined.
            </p>
          </div>

          {/* FORMS */}
          <div className="grid grid-cols-2 gap-8 my-8">
            <CampaignDetailsSection
              form={form}
              refs={{
                startDateRef,
                endDateRef,
              }}
            />

            <ClientDetailsForm
              contactEmail={form.contactEmail}
              setContactEmail={form.setContactEmail}
              errors={form.errors}
            />

            <DeliverablesForm
              deliverables={form.deliverables}
              addDeliverable={form.addDeliverable}
              updateDeliverable={form.updateDeliverable}
              adjustPrice={form.adjustPrice}
              errors={form.errors}
            />

            <div className="flex justify-end gap-4 mt-8 col-span-full">
              <Button
                variant="outline"
                size="xl"
                onClick={handleSaveDraft}
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Save Draft"}
              </Button>
              <Button
                className="bg-[#6b1fa8] text-primary-foreground hover:bg-[#581982] hover:-translate-y-px transition-all duration-150"
                size="xl"
                onClick={handleSendProposal}
                disabled={isPending}
              >
                <SendHorizontal size={16} className="mb-1" />
                {isPending ? "Sending..." : "Send Proposal"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )

}