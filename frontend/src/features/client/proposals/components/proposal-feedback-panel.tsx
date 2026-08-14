import { Pencil } from "lucide-react";
import Button from "@/src/components/atoms/button";
import { cn } from "@/lib/utils";

interface ProposalFeedbackPanelProps {
  feedback: string;
  onContractSigning: () => void;
  onDecline: () => void;
  onFeedbackChange: (feedback: string) => void;
  onReviseProposal: () => void;
  revisionSubmitted: boolean;
  isSubmitting?: boolean;
}

export default function ProposalFeedbackPanel({
  feedback,
  onContractSigning,
  onDecline,
  onFeedbackChange,
  onReviseProposal,
  revisionSubmitted,
  isSubmitting = false,
}: ProposalFeedbackPanelProps) {
  const canSubmitRevision = feedback.trim().length >= 30;

  return (
    <section className="rounded border border-[#d8d4cb] bg-white p-4">
      <h2 className="text-[28px] leading-none text-[#141518]">
        Add your Feedback here
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-[#6f6a63]">
        Please review the proposal carefully. You can accept the contract terms
        as they are, opt-in on some add-ons, request revisions, or decline the
        proposal.
      </p>

      <textarea
        className="mt-4 h-[230px] w-full resize-none border border-[#d8d4cb] p-3 text-sm italic text-[#141518] outline-none placeholder:text-[#7b7771] focus:border-[#6b1fa8]"
        placeholder="Enter any comment or revisions about specific terms you want to change"
        value={feedback}
        minLength={30}
        maxLength={500}
        onChange={(event) => onFeedbackChange(event.target.value)}
      />

      <div className="mt-4 space-y-3">
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-11 w-full rounded-none text-lg font-normal",
            canSubmitRevision
              ? "border-[#6b1fa8] bg-[#6b1fa8] text-white hover:bg-[#5f1a96]"
              : "border-[#d8d4cb] bg-white text-[#7b7771]",
          )}
          disabled={!canSubmitRevision || isSubmitting}
          onClick={onReviseProposal}
        >
          <Pencil className="size-5" />
          {isSubmitting
            ? "Submitting..."
            : revisionSubmitted
              ? "Revision Submitted"
              : "Revise Proposal"}
        </Button>
        <Button
          type="button"
          className="h-12 w-full rounded-none bg-[#6b1fa8] text-lg font-normal text-white hover:bg-[#5f1a96]"
          onClick={onContractSigning}
        >
          Contract Signing
          <span className="ml-4">--&gt;</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-none border-[#d8d4cb] bg-white text-lg font-normal text-[#7b7771]"
          onClick={onDecline}
        >
          Decline Proposal
        </Button>
      </div>
    </section>
  );
}
