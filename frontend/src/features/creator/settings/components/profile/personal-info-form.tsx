import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProfileSettings } from "../../containers/settings";
import { Separator } from "@/components/ui/separator";

interface PersonalInfoProps {
  data: ProfileSettings;
  isEditing: boolean;
  onChange: <K extends keyof ProfileSettings>(
    field: K,
    value: ProfileSettings[K],
  ) => void;
}

export function PersonalInfoSection({
  data,
  isEditing,
  onChange,
}: PersonalInfoProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full bg-white border rounded-lg shadow-sm"
      defaultValue="personal-info"
    >
      <AccordionItem value="personal-info" className="border-none">
        <AccordionTrigger className="px-8 pt-6 pb-4 hover:no-underline text-[#141518] text-2xl font-normal">
          Personal Information
        </AccordionTrigger>

        <AccordionContent className="px-8 pt-2">
          <Separator className="mb-6 -mt-2" />
          <div className="grid grid-cols-3 gap-6 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium uppercase text-muted-foreground">
                First Name
              </label>
              <Input
                value={data.firstName}
                className="border-muted"
                onChange={(e) => onChange("firstName", e.target.value)}
                placeholder="Enter first name"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium uppercase text-muted-foreground">
                Last Name
              </label>
              <Input
                value={data.lastName}
                className="border-muted"
                onChange={(e) => onChange("lastName", e.target.value)}
                placeholder="Enter last name"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium uppercase text-muted-foreground">
                Middle Name
              </label>
              <Input
                value={data.middleName}
                className="border-muted"
                placeholder="Enter middle name"
                disabled={!isEditing}
                onChange={(e) => onChange("middleName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium uppercase text-muted-foreground">
                Account Email
              </label>
              <Input
                value={data.accountEmail}
                className="border-muted"
                placeholder="Account email"
                type="email"
                disabled={!isEditing}
                onChange={(e) => onChange("accountEmail", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium uppercase text-muted-foreground">
                Phone Number
              </label>
              <Input
                value={data.phoneNumber}
                className="border-muted"
                placeholder="Enter phone number"
                inputMode="numeric"
                pattern="[0-9]*"
                disabled={!isEditing}
                onChange={(e) =>
                  onChange("phoneNumber", e.target.value.replace(/\D/g, ""))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium uppercase text-muted-foreground">
                Location / Timezone
              </label>
              <Select
                value={data.location}
                disabled={!isEditing}
                onValueChange={(value) => onChange("location", value)}
              >
                <SelectTrigger className="w-full border-muted">
                  <SelectValue placeholder="Select location and timezone" />
                </SelectTrigger>
                <SelectContent className="p-1">
                  <SelectItem value="Asia/Manila" className="rounded-[3px]">
                    Asia/Manila (GMT+8)
                  </SelectItem>
                  <SelectItem value="Asia/Tokyo" className="rounded-[3px]">
                    Asia/Tokyo (GMT+9)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
