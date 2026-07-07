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
  onAddCustom: () => void;
  onRemove: (id: string) => void;
  onAdjustPrice?: (id: string, amount: number) => void;
}

export default function AddOnsForm({ currency, addOns, onAddCustom, onRemove, onAdjustPrice }: AddOnFormProps) {
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
            {addOns.map((addon) => (
            <AddOnRow 
                key={addon.id}
                id={addon.id}
                defaultTitle={addon.title}
                defaultDesc={addon.desc}
                fee={addon.fee}
                titlePlaceholder="Add-on Name" 
                descPlaceholder="Description"
                currency={currency}
                onRemove={() => onRemove(addon.id)}
                onAdjustPrice={(amount) => onAdjustPrice?.(addon.id, amount)}/>
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