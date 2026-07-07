"use client"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import AddOnsForm from "@/src/features/creator/proposals/components/add-ons/add-ons-form";
import { useAddOns } from "@/src/features/creator/proposals/hooks/useAddOns"

interface AddOnsContainerProps {
  onBack: () => void
  onNext: () => void
}

export function AddOnsContainer({ onBack, onNext }: AddOnsContainerProps) {
    const { addOns, addCustom, removeAddOn, adjustPrice, updateAddOn, errors, validateForm } = useAddOns()

    return (
    <>
        <div className="mt-6">  
            <AddOnsForm
                currency="PHP"
                addOns={addOns}
                onAddCustom={addCustom}
                onRemove={removeAddOn}
                onAdjustPrice={adjustPrice}
                onUpdateAddOn={updateAddOn}
                errors={errors}
            />
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between mt-6 pb-8">
            <Button variant="outline" onClick={onBack}>
                <ArrowLeft size={16} /> Back
            </Button>
            <Button
                onClick={() => {
                    if (validateForm()) onNext()
                }}
                className="bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white flex items-center gap-2"
            >
                Payment Terms <ArrowRight size={16} />
            </Button>
        </div>
    </>
    )
}