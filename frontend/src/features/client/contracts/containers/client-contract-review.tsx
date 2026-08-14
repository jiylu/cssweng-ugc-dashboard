import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { useParams, useSearchParams } from "next/navigation";
import ContractActionPanel from "../components/contract-action-panel";
import ContractReviewHeader from "../components/contract-review-header";
import { useQuery } from "@tanstack/react-query";
import { getContractStatus } from "../services/contracts-api";

export default function ClientContractReview() {
  const params = useParams<{ proposalId: string }>();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const proposalPublicId = searchParams.get("proposal") ?? undefined;
  const { data: contract } = useQuery({
    queryKey: ["contract", params.proposalId],
    queryFn: () => getContractStatus(params.proposalId),
  });

  if (!user) {
    return;
  }

  return (
    <main className="min-h-screen bg-[#f2f0ea] pb-10">
      <ContractReviewHeader />

      <div className="grid grid-cols-[1fr_340px] gap-10 px-10 pt-6">
        <section className="min-h-[calc(100vh-150px)] rounded border border-[#d8d4cb] bg-white px-6 py-8">
          <h1 className="text-[28px] leading-none text-[#141518]">
            Contract Template
          </h1>

          <div className="mt-10 space-y-6 text-base leading-relaxed text-[#5f5b56]">
            <p>
              This proof-of-concept contract area will display the full contract
              generated from the accepted proposal, campaign deliverables,
              selected add-ons, payment summary, usage rights, and posting
              requirements.
            </p>
            <p>
              Static contract terms can be replaced by the backend-generated
              agreement once the contract feature is connected.
            </p>
          </div>
        </section>

        <aside className="pt-0">
          <ContractActionPanel
            contractPublicId={params.proposalId}
            proposalPublicId={proposalPublicId}
            contract={contract}
          />
        </aside>
      </div>
    </main>
  );
}
