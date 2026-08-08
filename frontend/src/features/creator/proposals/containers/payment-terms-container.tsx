"use client"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GiftedProductsSection } from "@/src/features/creator/proposals/components/payment-terms/gifted-products-section"
import { PaymentInvoicingSection } from "@/src/features/creator/proposals/components/payment-terms/payment-invoicing-section"
import { PriceSummarySection } from "@/src/features/creator/proposals/components/payment-terms/price-summary-section"
import { usePaymentTerms } from "@/src/features/creator/proposals/hooks/usePaymentTerms"

interface PaymentTermsContainerProps {
  paymentTerms: ReturnType<typeof usePaymentTerms>
  onBack: () => void
  onNext: () => void
  onSaveDraft: () => void
  onSubmit: () => void
  isPending: boolean
  baseCreatorFee: number
  currency: string
  taxRate: number
}

export function PaymentTermsContainer({ paymentTerms, onBack, onNext, baseCreatorFee, currency, taxRate }: PaymentTermsContainerProps) {
  return (
    <>
    <div className="flex flex-col gap-6">
      <GiftedProductsSection
        giftedProducts={paymentTerms.giftedProducts}
        onAdd={paymentTerms.addGiftedProduct}
        onRemove={paymentTerms.removeGiftedProduct}
        onUpdate={paymentTerms.updateGiftedProduct}
        currency={currency}
        errors={paymentTerms.errors}
      />

      <div className="grid grid-cols-2 gap-6">
        <PaymentInvoicingSection
          paymentSchedule={paymentTerms.paymentSchedule}
          setPaymentSchedule={paymentTerms.setPaymentSchedule}
          paymentMethod={paymentTerms.paymentMethod}
          setPaymentMethod={paymentTerms.setPaymentMethod}
          taxRate={paymentTerms.taxRate}
          setTaxRate={paymentTerms.setTaxRate}
          errors={paymentTerms.errors}
        />
        <PriceSummarySection
          baseCreatorFee={baseCreatorFee}
          currency={currency}
          taxRate={paymentTerms.taxRate}
      />
      </div>
    </div>

    {/* Bottom Actions */}
      <div className="flex justify-between mt-6 pb-8">
      <Button variant="outline" onClick={onBack}>
          <ArrowLeft size={16} /> Back
      </Button>
      <Button
          onClick={() => {
              if (paymentTerms.validateForm()) onNext()
          }}
          className="bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white flex items-center gap-2"
      >
          Proposal Summary <ArrowRight size={16} />
      </Button>
    </div>
  </>
  )
}