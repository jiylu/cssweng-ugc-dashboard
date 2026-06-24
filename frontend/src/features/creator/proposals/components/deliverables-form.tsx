import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Button from "@/src/components/atoms/button";
import { Card } from "@/src/components/atoms/card";
import { Deliverable } from "@/src/features/creator/proposals/types/deliverables.types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DatePickerInput } from "@/src/components/molecules/date-picker-input";
export interface DeliverablesFormProps {
  deliverables: Deliverable[]
  errors: Record<string, string>;

  addDeliverable: () => void
  updateDeliverable: (
    id: number,
    field: keyof Deliverable,
    value: string
  ) => void
  adjustPrice: (id: number, amount: number) => void
}

// TODO: make inputs from shadcn
export default function DeliverablesForm({ deliverables, addDeliverable, updateDeliverable, adjustPrice, errors }: DeliverablesFormProps) {
  return (
    <Card className="col-span-full">
      <h2 className="text-[26px] font-normal text-foreground">
        Deliverables & Pricing
      </h2>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-62">Deliverable</TableHead>
            <TableHead className="w-62">Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {deliverables.map((item) => (
            <TableRow
              key={item.id}
              className="hover:bg-transparent"
            >
              {/* Deliverable Name */}
              <TableCell>
                <Input
                  className="w-62 border-0 border-b border-border py-1.25 text-sm text-foreground bg-transparent outline-none transition-colors duration-200"
                  placeholder="Enter deliverable name"
                  value={item.deliverable_title}
                  onChange={(e) => updateDeliverable(item.id, 'deliverable_title', e.target.value)}
                />
              </TableCell>

              {/* Description */}
              <TableCell>
                <Textarea
                  className="w-62 min-h-[20px] border-0 border-b border-border py-1.25 text-sm text-foreground bg-transparent outline-none transition-colors duration-200 resize-none"
                  placeholder="Enter description"
                  value={item.description}
                  onChange={(e) => updateDeliverable(item.id, 'description', e.target.value)}
                />
              </TableCell>

              {/* Type */}
              <TableCell>
                <Select
                  value={item.deliverable_type}
                  onValueChange={(value) => updateDeliverable(item.id, 'deliverable_type', value)}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full rounded text-sm cursor-pointer border-muted",
                      !item.deliverable_type && "text-muted-foreground"
                    )}
                  >
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="COLLABORATION">Collaboration</SelectItem>
                      <SelectItem value="UGC">UGC</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </TableCell>

              {/* Deadline */}
              <TableCell>
                <DatePickerInput
                  value={item.deadline}
                  onChange={(iso) => updateDeliverable(item.id, 'deadline', iso)}
                />
                {errors.deadline && (
                  <p className="text-xs mt-1" style={{ color: "#ff6467" }}>{errors.deadline}</p>
                )}
              </TableCell>

              {/* Pricing */}
              <TableCell>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 border-b border-border pb-1">
                    <InputGroup className="max-w-xs border-0">
                      <InputGroupInput 
                        placeholder="0.00" 
                        className="w-full border-0 p-0 h-auto text-sm text-foreground bg-transparent shadow-none focus-visible:ring-0"
                        value={item.pricing}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.]/g, '');
                          const parts = val.split('.');
                          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                          updateDeliverable(item.id, 'pricing', parts.slice(0, 2).join('.'));
                        }}/>
                      <InputGroupAddon>PHP</InputGroupAddon>
                    </InputGroup>
                    <div className="flex flex-col ml-1 shrink-0">
                      <ChevronUp
                        size={14}
                        className="cursor-pointer text-[#9ca3af] hover:text-[#6b1fa8] transition-colors"
                        onClick={() => adjustPrice(item.id, 1000)}
                      />
                      <ChevronDown
                        size={14}
                        className="cursor-pointer text-[#9ca3af] hover:text-[#6b1fa8] transition-colors"
                        onClick={() => adjustPrice(item.id, -1000)}
                      />
                    </div>
                  </div>
                  {errors.pricing && (
                    <p className="text-xs mt-1" style={{ color: "#ff6467" }}>{errors.pricing}</p>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-4">
          <Button
            onClick={addDeliverable}
          >
            Add Deliverable
          </Button>
      </div>
    </Card>
  )
}