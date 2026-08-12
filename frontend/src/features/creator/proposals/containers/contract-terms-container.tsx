"use client"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreativeDirection } from "@/src/features/creator/proposals/components/contract-terms/creative-direction"
import { UsageRights } from "@/src/features/creator/proposals/components/contract-terms/usage-rights"
import { Exclusivity } from "@/src/features/creator/proposals/components/contract-terms/exclusivity"
import { Expenses } from "@/src/features/creator/proposals/components/contract-terms/expenses"
import { GeneralTerms } from "@/src/features/creator/proposals/components/contract-terms/general-terms"
import { useContractTerms } from "@/src/features/creator/proposals/hooks/useContractTerms"

interface ContractTermsContainerProps {
  contractTerms: ReturnType<typeof useContractTerms>
  currency: string
  campaignDates: { startDate: string; endDate: string }
  onBack: () => void
  onNext: () => void
}

export function ContractTermsContainer({ contractTerms, currency, campaignDates, onBack, onNext }: ContractTermsContainerProps) {
  return (
    <>
      <div className="flex flex-col gap-6">
        <CreativeDirection
          revisionRounds={contractTerms.revisionRounds}
          setRevisionRounds={contractTerms.setRevisionRounds}
          revisionDays={contractTerms.revisionDays}
          setRevisionDays={contractTerms.setRevisionDays}
          feedbackDays={contractTerms.feedbackDays}
          setFeedbackDays={contractTerms.setFeedbackDays}
          errors={contractTerms.errors}
        />
        <UsageRights
          includedOrganicUsage={contractTerms.includedOrganicUsage}
          setIncludedOrganicUsage={contractTerms.setIncludedOrganicUsage}
          territory={contractTerms.territory}
          setTerritory={contractTerms.setTerritory}
          restrictions={contractTerms.restrictions}
          setRestrictions={contractTerms.setRestrictions}
          contentRetention={contractTerms.contentRetention}
          setContentRetention={contractTerms.setContentRetention}
          partnershipTags={contractTerms.partnershipTags}
          setPartnershipTags={contractTerms.setPartnershipTags}
          errors={contractTerms.errors}
        />
        <Exclusivity
          hasExclusivity={contractTerms.hasExclusivity}
          setHasExclusivity={contractTerms.setHasExclusivity}
          exclusivityCategory={contractTerms.exclusivityCategory}
          setExclusivityCategory={contractTerms.setExclusivityCategory}
          exclusivityCompetitorList={contractTerms.exclusivityCompetitorList}
          setExclusivityCompetitorList={contractTerms.setExclusivityCompetitorList}
          exclusivityStartDate={contractTerms.exclusivityStartDate}
          setExclusivityStartDate={contractTerms.setExclusivityStartDate}
          exclusivityEndDate={contractTerms.exclusivityEndDate}
          setExclusivityEndDate={contractTerms.setExclusivityEndDate}
          exclusivityFee={contractTerms.exclusivityFee}
          setExclusivityFee={contractTerms.setExclusivityFee}
          exclusivityTerritory={contractTerms.exclusivityTerritory}
          setExclusivityTerritory={contractTerms.setExclusivityTerritory}
          currency={currency}
          errors={contractTerms.errors}
        />
        <Expenses
          reimbursementDays={contractTerms.reimbursementDays}
          setReimbursementDays={contractTerms.setReimbursementDays}
          giftedProductTerms={contractTerms.giftedProductTerms}
          setGiftedProductTerms={contractTerms.setGiftedProductTerms}
          cancellationDays={contractTerms.cancellationDays}
          setCancellationDays={contractTerms.setCancellationDays}
          errors={contractTerms.errors}
        />
        <GeneralTerms
          governingLaw={contractTerms.governingLaw}
          setGoverningLaw={contractTerms.setGoverningLaw}
          disputeLocation={contractTerms.disputeLocation}
          setDisputeLocation={contractTerms.setDisputeLocation}
          extraNotes={contractTerms.extraNotes}
          setExtraNotes={contractTerms.setExtraNotes}
          errors={contractTerms.errors}
        />
      </div>

      <div className="flex justify-between gap-3 mt-6 pb-8">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 p-5"
        >
          <ArrowLeft size={16} /> Back
        </Button>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              if (contractTerms.validateForm(campaignDates)) onNext()
            }}
            className="bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white flex items-center gap-2 p-5"
          >
            Add-Ons <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </>
  )
}