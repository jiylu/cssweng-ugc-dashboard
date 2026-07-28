import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShippingAddress } from "../../types/payment-terms.types"
import { useLocationData } from "../../hooks/useLocationData"
import { AddressField } from "./address-field"
import { LocationSelectField } from "./location-select-field"

interface ShippingAddressPopupProps {
  open: boolean
  onClose: () => void
  form: ShippingAddress
  errors: Record<string, string>
  onFieldChange: (field: keyof ShippingAddress, val: string) => void
  onSave: () => void
  currency: string
}

export function ShippingAddressPopup({ open, onClose, form, errors, onFieldChange, onSave, currency }: ShippingAddressPopupProps) {
  const {
    countries,
    states,
    cities,
    loadingCountries,
    loadingStates,
    loadingCities,
    loadStates,
    loadCities,
  } = useLocationData(currency)

  const selectedCountry = countries.find((c) => c.name === form.country)

  useEffect(() => {
    if (open && selectedCountry) {
      loadStates(selectedCountry.iso2)
    }
  }, [open, selectedCountry?.iso2])

  const selectedState = states.find((s) => s.name === form.stateProvince)

  useEffect(() => {
    if (open && selectedCountry && selectedState) {
      loadCities(selectedCountry.iso2, selectedState.iso2)
    }
  }, [open, selectedCountry?.iso2, selectedState?.iso2])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#F2F0EA]" showCloseButton>
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal">Shipping Address</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <AddressField
            label="Address Line 1"
            value={form.addressLine1}
            onChange={(v) => onFieldChange("addressLine1", v)}
            error={errors.addressLine1}
            helper="Street address, P.O. box, company name, c/o"
          />

          <AddressField
            label="Address Line 2"
            value={form.addressLine2}
            onChange={(v) => onFieldChange("addressLine2", v)}
            helper="Apartment, suite, unit, building, floor, etc."
          />

          <div className="grid grid-cols-2 gap-4">
            <LocationSelectField
              label="Country"
              value={form.country}
              onValueChange={(v) => onFieldChange("country", v)}
              options={countries.map((c) => ({ key: c.iso2, value: c.name }))}
              placeholder="Country"
              loading={loadingCountries}
              error={errors.country}
            />
            <LocationSelectField
              label="State/Province"
              value={form.stateProvince}
              onValueChange={(v) => onFieldChange("stateProvince", v)}
              options={states.map((s) => ({ key: s.iso2, value: s.name }))}
              placeholder="Province"
              loading={loadingStates}
              disabled={!form.country}
              error={errors.stateProvince}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <LocationSelectField
              label="City"
              value={form.city}
              onValueChange={(v) => onFieldChange("city", v)}
              options={cities.map((c) => ({ key: c.name, value: c.name }))}
              placeholder="City"
              loading={loadingCities}
              disabled={!form.stateProvince}
              error={errors.city}
            />
            <AddressField
              label="Zip Code"
              value={form.zipCode}
              onChange={(v) => onFieldChange("zipCode", v)}
              placeholder="Enter Zip Code"
              error={errors.zipCode}
            />
          </div>

          <Button
            onClick={onSave}
            className="w-full bg-[#6b1fa8] hover:bg-[#5a1a8f] text-white rounded-[3px] mt-2"
          >
            Save Address
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
