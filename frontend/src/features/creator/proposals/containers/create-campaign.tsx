import { useRef } from "react";
import CreatorProposalsNavigation from "../components/proposals-nav";
import CreatorSidebar from "../../dashboard/components/creator-sidebar";
import { useCampaignForm } from "../hooks/useCampaignForm";
import CampaignDetailsSection from "../components/campaign-details-form";
import ClientDetailsForm from "../components/client-details-form";
import { Separator } from "@/components/ui/separator";
import DeliverablesForm from "../components/deliverables-form";

export default function CreateCampaign() {
  const form = useCampaignForm();
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  
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

            <DeliverablesForm />
          </div>
        </div>



      </section>
    </main>
  )

}