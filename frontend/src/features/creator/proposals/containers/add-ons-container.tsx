"use client"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import AddOnsForm from "../components/add-ons/add-ons-form";
import { useContractTerms } from "@/src/features/creator/proposals/hooks/useContractTerms"

interface AddOnsContainerProps {
  onBack: () => void
  onNext: () => void
}

export function AddOnsContainer({ onBack, onNext }: AddOnsContainerProps) {
  const contractTerms = useContractTerms()

  return (
    <>
        <div className="mt-6">
            <AddOnsForm
                currency="PHP" // HARD CODED PA
                addOns={[]} // NO DATA YET
                onAddCustom={() => console.log("Clicked add custom button")}
                onRemove={(id) => console.log("Removed ", id)}
                onAdjustPrice={(id, amount) => console.log("Adjusted price for", id, amount)}
            />
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between mt-6 pb-8">
            <Button variant="outline" onClick={onBack}>
                <ArrowLeft size={16} /> Back
            </Button>
            <Button
                onClick={onNext}
                className="bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white flex items-center gap-2"
            >
                Payment Terms <ArrowRight size={16} />
            </Button>
        </div>
    </>
  )
}