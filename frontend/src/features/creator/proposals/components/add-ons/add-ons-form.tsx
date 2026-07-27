import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { AddOnRow } from "./add-ons-row";
import { AddOnItem } from "@/src/features/creator/proposals/types/add-on.types"

export interface AddOnFormProps {
    currency: string; 
    addOns: AddOnItem[];
    errors: Record<string, string>;
    onAddCustom: () => void;
    onToggle: (id: string) => void;
    onRemove: (id: string) => void;
    onAdjustPrice?: (id: string, amount: number) => void;
    onUpdateAddOn?: (id: string, field: keyof AddOnItem, value: string | number) => void;
}

export default function AddOnsForm({ currency, addOns, onAddCustom, onToggle, onRemove, onAdjustPrice, onUpdateAddOn, errors }: AddOnFormProps) {
    return (
        <div className="bg-white border border-border rounded-[3px] p-5.5 flex flex-col">
            <h2 className="text-[26px] font-normal text-foreground mb-2">Campaign Add-Ons</h2>

            {/* Headers */}
            <div className="grid grid-cols-12 gap-4 py-2 px-6 -mx-6 bg-[#e8e4dc] border-y border-border text-base text-foreground font-medium">
                <div className="col-span-4">Add-On</div>
                <div className="col-span-5">Description</div>
                <div className="col-span-3 pr-12">Fee</div>
            </div>

            {/* Rows */}
            <div className="flex flex-col">
                {addOns.map((addon, index) => (
                <AddOnRow 
                    key={addon.id}
                    item={addon}
                    index={index}
                    errors={errors}
                    currency={currency}
                    onToggle={() => onToggle(addon.id)}
                    onRemove={() => onRemove(addon.id)}
                    onAdjustPrice={(amount) => onAdjustPrice?.(addon.id, amount)}
                    onTitleChange={(value) => onUpdateAddOn?.(addon.id, 'title', value)}
                    onDescChange={(value) => onUpdateAddOn?.(addon.id, 'desc', value)}
                    onFeeChange={(value) => onUpdateAddOn?.(addon.id, 'fee', value)}/>
                ))}
            </div>

            {/* Custom button */}
            <div className="mt-4 flex justify-center">
                <Button 
                    variant="ghost" 
                    onClick={onAddCustom}
                    className="flex items-center gap-2 border border-[#6b1fa8] text-[#6b1fa8] bg-transparent hover:text-[#6b1fa8] hover:bg-[#6b1fa8]/10 transition-colors rounded-[3px] px-6 py-5 text-sm font-medium">
                    <CirclePlus className="mb-1" size={18} /> Add a custom add-on
                </Button>
            </div>
        </div>
    );
}