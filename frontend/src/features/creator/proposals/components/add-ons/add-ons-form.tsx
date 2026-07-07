import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
        <div className="bg-white border border-border rounded-[3px] p-5.5 flex flex-col gap-2">
        <h2 className="text-[26px] font-normal text-foreground mb-4">Campaign Add-Ons</h2>

        {/* Headers */}
        <div className="grid grid-cols-12 gap-6 pb-2 border-b border-border text-xs text-muted-foreground uppercase tracking-[0.03em] font-medium">
            <div className="col-span-3">Add-On</div>
            <div className="col-span-5">Description</div>
            <div className="col-span-4 text-right pr-12">Fee</div>
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
                onFeeChange={(value) => onUpdateAddOn?.(addon.id, 'fee', value)}
        />
            ))}
        </div>

        {/* Custom button */}
        <div className="mt-4 flex justify-start">
            <Button 
            variant="ghost" 
            onClick={onAddCustom}
            className="text-[#6b1fa8] hover:text-[#5a1a8f] hover:bg-[#6b1fa8]/10 px-2 flex items-center gap-2 rounded-[2px]"
            >
            <Plus size={16} /> Add a custom add-on
            </Button>
        </div>
        </div>
    );
}