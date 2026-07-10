import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import CampaignOverviewCard from "../components/campaign-overview-card";
import ContractTermsSection from "../components/contract-terms-section";
import DeliverablesTable from "../components/deliverables-table";
import OptionalAddOnsCard from "../components/optional-add-ons-card";
import PaymentSummaryCard from "../components/payment-summary-card";
import ProposalFeedbackPanel from "../components/proposal-feedback-panel";
import ProposalReviewHeader from "../components/proposal-review-header";
import type {
  ContractTerm,
  ProposalAddOn,
  ProposalDeliverable,
} from "../types/proposal-review.types";

const description =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const deliverables: ProposalDeliverable[] = [
  {
    quantity: 1,
    deliverable: "[Type][Platform&Format]",
    requirements:
      "9:16, 30-60 seconds, voiceover, product visible, caption, tags, hashtags",
    dueDate: "7/7/2026",
    postDate: "7/8/2026",
    price: "100 CAD",
  },
  {
    quantity: 4,
    deliverable: "UGC Instagram Reel",
    requirements: "Review",
    dueDate: "7/7/2026",
    postDate: "7/8/2026",
    price: "100 CAD",
  },
  {
    quantity: 3,
    deliverable: "Partnership Youtube Shorts",
    requirements: "Feature Spotlight",
    dueDate: "7/7/2026",
    postDate: "7/8/2026",
    price: "100 CAD",
  },
];

const terms: ContractTerm[] = [
  {
    title: "Revision Policy",
    description:
      "The fee includes [one (1)] round of reasonable revisions, requested within [3] business days of draft delivery.",
  },
  {
    title: "Auto Approval",
    description:
      "If Brand does not provide feedback within [5] business days, the draft will be considered approved, unless otherwise agreed in writing.",
  },
  {
    title: "Cancellation",
    description:
      "Either Party may terminate this Agreement if the other Party materially breaches the Agreement and does not fix the issue within [7] days after written notice.",
  },
  {
    title: "Usage Rights",
    description:
      "Creator owns the content Creator creates, unless the Parties agree otherwise in writing. Creator grants Brand a non-exclusive, non-transferable license to use the approved Deliverables.",
  },
  {
    title: "Post Longevity",
    description:
      "Unless otherwise stated, published posts must remain live for at least [12 months], subject to normal platform errors, removals, or account issues outside Creator's control.",
  },
  {
    title: "Posting Requirements",
    description:
      "Creator will clearly disclose the partnership using appropriate disclosure language and applicable advertising laws, platform rules, and industry guidelines.",
  },
];

const addOns: ProposalAddOn[] = [
  {
    id: "add-on-1",
    name: "Add-on 1",
    description: "Description...",
    price: "$150.00",
    selected: false,
  },
  {
    id: "add-on-2",
    name: "Add-on 2",
    description: "Description...",
    price: "$150.00",
    selected: true,
  },
  {
    id: "add-on-3",
    name: "Add-on 3",
    description: "Description...",
    price: "$150.00",
    selected: false,
  },
];

export default function ClientProposalReview() {
  const params = useParams<{ proposalId?: string }>();
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [revisionSubmitted, setRevisionSubmitted] = useState(false);
  const proposalId = params.proposalId ?? "preview";

  const handleReviseProposal = () => {
    if (!feedback.trim()) return;
    setRevisionSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#f2f0ea] pb-14">
      <ProposalReviewHeader />

      <div className="grid grid-cols-[1fr_340px] gap-10 px-10 pt-8">
        <section className="min-w-0 space-y-9">
          <h1 className="text-[58px] leading-none text-[#141518]">
            Proposal Review
          </h1>

          <CampaignOverviewCard
            creatorName="[Creator Name]"
            description={description}
            startDate="July 7, 2026"
            endDate="Oct 15, 2026"
          />

          <DeliverablesTable deliverables={deliverables} />

          <ContractTermsSection terms={terms} />

          <OptionalAddOnsCard addOns={addOns} />
        </section>

        <aside className="space-y-12 pt-[44px]">
          <ProposalFeedbackPanel
            feedback={feedback}
            onContractSigning={() => router.push(`/contracts/${proposalId}`)}
            onDecline={() => router.push("/dashboard")}
            onFeedbackChange={(value) => {
              setFeedback(value);
              setRevisionSubmitted(false);
            }}
            onReviseProposal={handleReviseProposal}
            revisionSubmitted={revisionSubmitted}
          />
          <PaymentSummaryCard />
        </aside>
      </div>
    </main>
  );
}
