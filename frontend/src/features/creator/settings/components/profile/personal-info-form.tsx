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
  errors: Partial<Record<keyof ProfileSettings, string>>;
  isEditing: boolean;
  onChange: <K extends keyof ProfileSettings>(
    field: K,
    value: ProfileSettings[K],
  ) => void;
}

const sanitizeNameInput = (value: string) =>
  value.replace(/[^\p{L}\p{M}'’\-\s]/gu, "").replace(/\s{2,}/g, " ");

export function PersonalInfoSection({
  data,
  errors,
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
              <label className="text-sm font-medium uppercase text-[#141518]">
                First Name<span className="ml-1 text-[#ff6467]">*</span>
              </label>
              {isEditing ? <Input
                value={data.firstName}
                aria-invalid={Boolean(errors.firstName)}
                onChange={(e) =>
                  onChange("firstName", sanitizeNameInput(e.target.value))
                }
                placeholder="Enter first name"
              /> : <p className="py-2 text-base text-[#141518]">{data.firstName || "—"}</p>}
              {isEditing && errors.firstName && <p className="text-xs text-[#ff6467]">{errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium uppercase text-[#141518]">
                Last Name<span className="ml-1 text-[#ff6467]">*</span>
              </label>
              {isEditing ? <Input
                value={data.lastName}
                aria-invalid={Boolean(errors.lastName)}
                onChange={(e) =>
                  onChange("lastName", sanitizeNameInput(e.target.value))
                }
                placeholder="Enter last name"
              /> : <p className="py-2 text-base text-[#141518]">{data.lastName || "—"}</p>}
              {isEditing && errors.lastName && <p className="text-xs text-[#ff6467]">{errors.lastName}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium uppercase text-[#141518]">
                Middle Name
              </label>
              {isEditing ? <Input
                value={data.middleName}
                placeholder="Enter middle name"
                onChange={(e) =>
                  onChange("middleName", sanitizeNameInput(e.target.value))
                }
              /> : <p className="py-2 text-base text-[#141518]">{data.middleName || "—"}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium uppercase text-[#141518]">
                Account Email<span className="ml-1 text-[#ff6467]">*</span>
              </label>
              {isEditing ? <Input
                value={data.accountEmail}
                aria-invalid={Boolean(errors.accountEmail)}
                placeholder="Account email"
                type="email"
                onChange={(e) => onChange("accountEmail", e.target.value)}
              /> : <p className="py-2 text-base text-[#141518]">{data.accountEmail || "—"}</p>}
              {isEditing && errors.accountEmail && <p className="text-xs text-[#ff6467]">{errors.accountEmail}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium uppercase text-[#141518]">
                Phone Number
              </label>
              {isEditing ? <Input
                value={data.phoneNumber}
                aria-invalid={Boolean(errors.phoneNumber)}
                placeholder="Enter phone number"
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) =>
                  onChange("phoneNumber", e.target.value.replace(/\D/g, ""))
                }
              /> : <p className="py-2 text-base text-[#141518]">{data.phoneNumber || "—"}</p>}
              {isEditing && errors.phoneNumber && <p className="text-xs text-[#ff6467]">{errors.phoneNumber}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium uppercase text-[#141518]">
                Location / Timezone<span className="ml-1 text-[#ff6467]">*</span>
              </label>
              {isEditing ? <Select
                value={data.location}
                onValueChange={(value) => onChange("location", value)}
              >
                <SelectTrigger className="w-full" aria-invalid={Boolean(errors.location)}>
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
              </Select> : (
                <p className="py-2 text-base text-[#141518]">
                  {data.location === "Asia/Manila" ? "Asia/Manila (GMT+8)" : data.location === "Asia/Tokyo" ? "Asia/Tokyo (GMT+9)" : data.location || "—"}
                </p>
              )}
              {isEditing && errors.location && <p className="text-xs text-[#ff6467]">{errors.location}</p>}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
