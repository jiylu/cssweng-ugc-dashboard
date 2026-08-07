import { useRouter } from "next/navigation";
import Button from "@/src/components/atoms/button";
import SignContractModal from "./sign-contract-modal";

interface ContractActionPanelProps {
  id: string;
}

export default function ContractActionPanel({ id }: ContractActionPanelProps) {
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
        <SignContractModal
          id={id}
        />
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-none border-[#d8d4cb] bg-white text-lg font-normal text-[#7b7771]"
          onClick={() => router.push("/dashboard")}
        >
          Decline Proposal
        </Button>
      </div>
    </section>
  );
}
