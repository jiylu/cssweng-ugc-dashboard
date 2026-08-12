import { Input } from "@/components/ui/input"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { ProfileSettings } from "../../containers/settings"
import { Separator } from "@/components/ui/separator"

interface PersonalInfoProps {
    data: ProfileSettings;
    onChange: (field: keyof ProfileSettings, value: any) => void;
}

export function PersonalInfoSection({ data, onChange }: PersonalInfoProps) {
    return (
        <Accordion type="single" collapsible className="w-full bg-white border rounded-lg shadow-sm" defaultValue="personal-info">
            <AccordionItem value="personal-info" className="border-none">
                <AccordionTrigger className="px-8 pt-6 pb-4 hover:no-underline text-[#141518] text-2xl font-normal">
                    Personal Information
                </AccordionTrigger>

                <AccordionContent className="px-8 pt-2">
                    <Separator className="mb-6 -mt-2" />
                    <div className="grid grid-cols-3 gap-6 mb-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium uppercase text-[#141518]">First Name</label>
                            <Input value={data.firstName} onChange={(e) => onChange("firstName", e.target.value)} placeholder="Enter first name" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium uppercase text-[#141518]">Last Name</label>
                            <Input value={data.lastName} onChange={(e) => onChange("lastName", e.target.value)} placeholder="Enter last name" />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium uppercase text-[#141518]">Middle Name</label>
                            <Input value={data.middleName} onChange={(e) => onChange("middleName", e.target.value)} placeholder="Enter middle name" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium uppercase text-[#141518]">Account Email</label>
                            <Input value={data.accountEmail} onChange={(e) => onChange("accountEmail", e.target.value)} placeholder="Enter email" type="email" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium uppercase text-[#141518]">Phone Number</label>
                            <Input value={data.phoneNumber} onChange={(e) => onChange("phoneNumber", e.target.value)} placeholder="e.g., 09170000000" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium uppercase text-[#141518]">Location / Timezone</label>
                            <Select value={data.location} onValueChange={(val) => onChange("location", val)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select location and timezone" />
                                </SelectTrigger>
                                <SelectContent className="p-1">
                                    <SelectItem value="manila" className="rounded-[3px]">Asia/Manila (GMT+8)</SelectItem>
                                    <SelectItem value="tokyo" className="rounded-[3px]">Asia/Tokyo (GMT+9)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}