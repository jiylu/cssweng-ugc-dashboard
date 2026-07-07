import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { AddOnRow, type CurrencyEnum } from "./add-ons-row";

export interface AddOnItem {
    id: string;
    title: string;
    desc: string;
    fee?: number;
}

export interface AddOnFormProps {
    currency: CurrencyEnum; 
    addOns: AddOnItem[];
    errors: Record<string, string>;
    onAddCustom: () => void;
    onRemove: (id: string) => void;
    onAdjustPrice?: (id: string, amount: number) => void;
    onUpdateAddOn?: (id: string, field: keyof AddOnItem, value: string | number) => void;
}

export default function AddOnsForm({ currency, addOns, onAddCustom, onRemove, onAdjustPrice, onUpdateAddOn, errors }: AddOnFormProps) {
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
                    index={index}
                    errors={errors}
                    id={addon.id}
                    title={addon.title}
                    desc={addon.desc}
                    fee={addon.fee}
                    currency={currency}
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