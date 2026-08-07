"use client"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import AddOnsForm from "@/src/features/creator/proposals/components/add-ons/add-ons-form";
import { useAddOns } from "@/src/features/creator/proposals/hooks/useAddOns"

interface AddOnsContainerProps {
    addOns: ReturnType<typeof useAddOns>
    currency: string
    onBack: () => void
    onNext: () => void
}

export function AddOnsContainer({ addOns, currency, onBack, onNext }: AddOnsContainerProps) {
    return (
    <>
        <div className="mt-6">  
            <AddOnsForm
                currency={currency}
                addOns={addOns.addOns}
                onAddCustom={addOns.addCustom}
                onToggle={addOns.toggleAddOn}
                onRemove={addOns.removeAddOn}
                onAdjustPrice={addOns.adjustPrice}
                onUpdateAddOn={addOns.updateAddOn}
                errors={addOns.errors}
            />
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between mt-6 pb-8">
            <Button variant="outline" onClick={onBack}>
                <ArrowLeft size={16} /> Back
            </Button>
            <Button
                onClick={() => {
                    if (addOns.validateForm()) onNext()
                }}
                className="bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white flex items-center gap-2"
            >
                Payment Terms <ArrowRight size={16} />
            </Button>
        </div>
    </>
    )
}