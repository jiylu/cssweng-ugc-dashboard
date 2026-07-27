import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { ShippingAddress } from "../../types/payment-terms.types"

const COUNTRIES = ["Philippines", "United States", "United Kingdom", "Australia", "Canada", "Singapore"]
const PROVINCES: Record<string, string[]> = {
  Philippines: ["Metro Manila", "Cebu", "Davao", "Laguna", "Cavite", "Bulacan"],
  "United States": ["California", "New York", "Texas", "Florida", "Illinois"],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  Australia: ["New South Wales", "Victoria", "Queensland", "Western Australia"],
  Canada: ["Ontario", "Quebec", "British Columbia", "Alberta"],
  Singapore: ["Central Region", "East Region", "North Region", "West Region"],
}
const CITIES: Record<string, string[]> = {
  "Metro Manila": ["Makati", "Taguig", "Quezon City", "Manila", "Pasig", "Mandaluyong"],
  Cebu: ["Cebu City", "Mandaue", "Lapu-Lapu"],
  California: ["Los Angeles", "San Francisco", "San Diego"],
  "New York": ["New York City", "Buffalo", "Albany"],
}

interface ShippingAddressPopupProps {
  open: boolean
  onClose: () => void
  value: ShippingAddress | null
  onSave: (address: ShippingAddress) => void
}

export function ShippingAddressPopup({ open, onClose, value, onSave }: ShippingAddressPopupProps) {
  const [form, setForm] = useState<ShippingAddress>(value ?? {
    addressLine1: "",
    addressLine2: "",
    country: "",
    stateProvince: "",
    city: "",
    zipCode: "",
  })

  function update(field: keyof ShippingAddress, val: string) {
    setForm((prev) => ({
      ...prev,
      [field]: val,
      ...(field === "country" ? { stateProvince: "", city: "" } : {}),
      ...(field === "stateProvince" ? { city: "" } : {}),
    }))
  }

  const provinces = PROVINCES[form.country] ?? []
  const cities = CITIES[form.stateProvince] ?? []

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#F2F0EA]" showCloseButton>
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal">Shipping Address</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          {/* Address Line 1 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-foreground">Address Line 1</label>
            <Input
              value={form.addressLine1}
              onChange={(e) => update('addressLine1', e.target.value)}
              className="bg-white border-border rounded-[3px] text-sm"
            />
            <p className="text-xs text-muted-foreground">Street address, P.O. box, company name, c/o</p>
          </div>

          {/* Address Line 2 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-foreground">Address Line 2</label>
            <Input
              value={form.addressLine2}
              onChange={(e) => update('addressLine2', e.target.value)}
              className="bg-white border-border rounded-[3px] text-sm"
            />
            <p className="text-xs text-muted-foreground">Apartment, suite, unit, building, floor, etc.</p>
          </div>

          {/* Country + State */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-foreground">Country</label>
              <Select value={form.country} onValueChange={(v) => update('country', v)}>
                <SelectTrigger className="bg-white border-border rounded-[3px] text-sm">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-foreground">State/Province</label>
              <Select value={form.stateProvince} onValueChange={(v) => update('stateProvince', v)} disabled={!form.country}>
                <SelectTrigger className="bg-white border-border rounded-[3px] text-sm">
                  <SelectValue placeholder="Province" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* City + Zip */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-foreground">City</label>
              <Select value={form.city} onValueChange={(v) => update('city', v)} disabled={!form.stateProvince}>
                <SelectTrigger className="bg-white border-border rounded-[3px] text-sm">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.length > 0 ? cities.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  )) : form.stateProvince ? (
                    <SelectItem value={form.stateProvince}>{form.stateProvince}</SelectItem>
                  ) : null}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-foreground">Zip Code</label>
              <Input
                value={form.zipCode}
                onChange={(e) => update('zipCode', e.target.value)}
                placeholder="Enter Zip Code"
                className="bg-white border-border rounded-[3px] text-sm"
              />
            </div>
          </div>

          <Button
            onClick={() => { onSave(form); onClose() }}
            className="w-full bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white rounded-[3px] mt-2"
          >
            Save Address
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}