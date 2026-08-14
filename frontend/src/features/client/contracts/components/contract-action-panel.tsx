import { useRouter } from "next/navigation";
import Button from "@/src/components/atoms/button";
import SignContractModal from "./sign-contract-modal";
import type { ContractStatus } from "../services/contracts-api";

interface ContractActionPanelProps {
  contractPublicId: string;
  proposalPublicId?: string;
  contract?: ContractStatus;
}

export default function ContractActionPanel({ contractPublicId, proposalPublicId, contract }: ContractActionPanelProps) {
  const router = useRouter();

  return (
    <section className="rounded border border-[#d8d4cb] bg-white p-5">
      <h2 className="text-[28px] leading-none text-[#141518]">
        Review Contract
      </h2>
      <p className="mt-6 text-sm leading-relaxed text-[#6f6a63]">
        Please review the contract carefully. You can accept the contract terms
        as they are, opt-in on some add-ons, request revisions, or decline the
        contract.
      </p>

      <div className="mt-12 space-y-3">
        {contract?.client_signed && contract.creator_signed ? (
          <div className="rounded border border-green-200 bg-green-50 p-4 text-center text-sm text-green-800">
            This contract has been signed by both parties.
            {contract.effective_date && <p className="mt-1">Effective {new Date(contract.effective_date).toLocaleDateString()}.</p>}
          </div>
        ) : contract?.client_signed ? (
          <div className="rounded border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-800">
            You have signed this contract. Waiting for the creator’s signature.
          </div>
        ) : (
          <SignContractModal
            contractPublicId={contractPublicId}
            proposalPublicId={proposalPublicId}
          />
        )}
        {!(contract?.client_signed && contract.creator_signed) && (
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-none border-[#d8d4cb] bg-white text-lg font-normal text-[#7b7771]"
            onClick={() => router.push("/dashboard")}
          >
            Decline Proposal
          </Button>
        )}
      </div>
    </section>
  );
}
