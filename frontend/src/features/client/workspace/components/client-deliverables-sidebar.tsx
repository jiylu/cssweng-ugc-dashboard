import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDate } from "@/src/utils/date";
import type { DeliverableItem } from "../services/deliverable-submissions-api";

interface Deliverable {
  public_id: string;
  deliverable_type: string;
  deliverable_content: string;
  due_date: string;
}

interface ClientDeliverablesSidebarProps {
  deliverables: Deliverable[];
  items: DeliverableItem[];
  activeDeliverable: number;
  activeDeliverableItem: number;
  activeStep: number;
  onChange: (index: number) => void;
  onItemChange: (index: number) => void;
  onStepChange: (step: number) => void;
}

const STEPS = ["Written Assets", "Media Assets", "Completed"];

function itemProgressStep(item: DeliverableItem) {
  if (item.deliverable_item_status === "APPROVED") return 2;
  if (item.written_asset_approved) return 1;
  return 0;
}

function DeliverableSteps({
  activeStep,
  onStepChange,
}: {
  activeStep: number;
  onStepChange: (step: number) => void;
}) {
  return (
    <ul className="flex flex-col">
      {STEPS.map((step, index) => {
        const isCompleted = index < activeStep;
        const isCurrent = index === activeStep;
        const isLast = index === STEPS.length - 1;

        return (
          <li key={step}>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onStepChange(index);
              }}
              className="flex w-full items-stretch gap-3 text-left"
            >
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "size-2 shrink-0 rounded-full transition-colors",
                    isCompleted
                      ? "bg-[#2d7a3a]"
                      : isCurrent
                        ? "bg-[#6b1fa8]"
                        : "bg-[#c9c4bb]",
                  )}
                />
                {!isLast && (
                  <span
                    className={cn(
                      "my-1 flex-1 border-l border-dashed transition-colors",
                      isCompleted
                        ? "border-[#2d7a3a]"
                        : "border-[#6b1fa8]/40",
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-sm",
                  !isLast && "pb-3",
                  isCurrent
                    ? "font-medium text-[#6b1fa8]"
                    : isCompleted
                      ? "text-[#2d7a3a]"
                      : "text-muted-foreground",
                )}
              >
                {step}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function ClientDeliverablesSidebar({
  deliverables,
  items,
  activeDeliverable,
  activeDeliverableItem,
  activeStep,
  onChange,
  onItemChange,
  onStepChange,
}: ClientDeliverablesSidebarProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col gap-3">
      <p className="text-2xl text-foreground">Deliverables</p>
      {deliverables.map((deliverable, index) => {
        const isActive = activeDeliverable === index;

        return (
          <div
            key={deliverable.public_id}
            className={cn(
              "w-full overflow-hidden rounded-[3px] border border-border bg-white",
              isActive && "border-[#6b1fa8]",
            )}
          >
            <button
              type="button"
              onClick={() => onChange(index)}
              className={cn(
                "flex w-full items-start justify-between gap-2 px-4 py-3 text-left",
                isActive && "bg-[#6b1fa8]",
              )}
            >
              <span className="flex flex-col gap-1">
                <span
                  className={cn(
                    "text-xs font-semibold",
                    isActive ? "text-white" : "text-foreground",
                  )}
                >
                  {deliverable.deliverable_content}
                </span>
                <span
                  className={cn(
                    "text-xs",
                    isActive ? "text-white/80" : "text-muted-foreground",
                  )}
                >
                  Due: {formatDate(new Date(deliverable.due_date))}
                </span>
              </span>
              <Badge
                className={cn(
                  "shrink-0 rounded-sm border-0 px-2 py-0.5 text-[10px] font-medium tracking-[0.03em]",
                  isActive ? "bg-white/15 text-white" : "bg-[#6b1fa8] text-white",
                )}
              >
                {deliverable.deliverable_type}
              </Badge>
            </button>

            {isActive && items.length > 0 && (
              <div className="flex flex-col gap-4 px-4 py-4">
                {items.map((item, itemIndex) => {
                  const isItemActive = itemIndex === activeDeliverableItem;
                  const progressStep = isItemActive
                    ? activeStep
                    : itemProgressStep(item);
                  const isApproved = item.deliverable_item_status === "APPROVED";
                  const itemName =
                    items.length > 1
                      ? `${deliverable.deliverable_content} ${item.deliverable_index}`
                      : deliverable.deliverable_content;

                  return (
                    <div key={item.public_id} className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => onItemChange(itemIndex)}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 rounded-[3px] px-3 py-2 text-left transition-colors",
                          isItemActive
                            ? "bg-[#6b1fa8]/10 text-[#6b1fa8]"
                            : "bg-muted text-foreground hover:bg-muted/70",
                        )}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="truncate text-sm font-medium">{itemName}</span>
                          <span
                            className={cn(
                              "shrink-0 rounded-[3px] px-1.5 py-0.5 text-[10px] font-medium",
                              isApproved
                                ? "bg-[#e7f4ea] text-[#2d7a3a]"
                                : "bg-muted-foreground/10 text-muted-foreground",
                            )}
                          >
                            {isApproved ? "Completed" : "Drafting"}
                          </span>
                        </span>
                        {isApproved && <CheckCircle2 className="size-4 shrink-0 text-[#2d7a3a]" />}
                      </button>
                      <div className="pl-3">
                        <DeliverableSteps
                          activeStep={progressStep}
                          onStepChange={(step) => {
                            onItemChange(itemIndex);
                            onStepChange(step);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
}
