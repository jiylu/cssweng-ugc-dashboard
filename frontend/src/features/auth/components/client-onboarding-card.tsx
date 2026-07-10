import Button from "@/src/components/atoms/button";
import type { useClientOnboarding } from "../hooks/useClientOnboarding";

interface ClientOnboardingCardProps {
  onboardingForm: ReturnType<typeof useClientOnboarding>;
}

const inputClassName =
  "h-12 w-full border border-[#9f9f9f] px-4 text-lg text-[#141518] placeholder:text-[#777] placeholder:italic focus:border-[#6b1fa8] focus:outline-none";

function Field({
  error,
  id,
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  error?: string;
  id: string;
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
  value: string;
}) {
  return (
    <label className="block space-y-2 text-[22px] leading-none text-[#5f5f5f]">
      {label}
      <input
        id={id}
        type={type}
        className={inputClassName}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && (
        <p role="alert" className="text-sm text-[#ff6467]">
          {error}
        </p>
      )}
    </label>
  );
}

export default function ClientOnboardingCard({
  onboardingForm,
}: ClientOnboardingCardProps) {
  const { errors, form, handleChange, handleSubmit } = onboardingForm;

  return (
    <section className="mx-auto w-full max-w-[860px] rounded border border-[#d8d4cb] bg-white px-10 py-8 max-md:px-6">
      <form className="space-y-10" onSubmit={handleSubmit}>
        <div>
          <h2 className="text-[36px] leading-none text-[#141518] max-md:text-3xl">
            Company Information
          </h2>
          <div className="mt-3 h-px w-full bg-[#d8d4cb]" />

          <div className="mt-6 grid grid-cols-2 gap-x-20 gap-y-6 max-md:grid-cols-1">
            <Field
              id="companyLegalName"
              label="Company Legal Name"
              placeholder="Enter company legal name"
              value={form.companyLegalName}
              error={errors.companyLegalName}
              onChange={handleChange}
            />
            <Field
              id="companyEmail"
              type="email"
              label="Company Email Address"
              placeholder="Enter company email address"
              value={form.companyEmail}
              error={errors.companyEmail}
              onChange={handleChange}
            />
            <Field
              id="companyAddress"
              label="Company Address"
              placeholder="Enter company address"
              value={form.companyAddress}
              error={errors.companyAddress}
              onChange={handleChange}
            />
            <Field
              id="companyPhoneNumber"
              type="tel"
              label="Company Phone Number"
              placeholder="Enter company phone number"
              value={form.companyPhoneNumber}
              error={errors.companyPhoneNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <h2 className="text-[36px] leading-none text-[#141518] max-md:text-3xl">
            Contact and Billing Details
          </h2>
          <div className="mt-3 h-px w-full bg-[#d8d4cb]" />

          <div className="mt-6 grid grid-cols-2 gap-x-20 gap-y-6 max-md:grid-cols-1">
            <Field
              id="contactPerson"
              label="Contact Person"
              placeholder="Enter full name of contact person"
              value={form.contactPerson}
              error={errors.contactPerson}
              onChange={handleChange}
            />
            <Field
              id="contactNumber"
              type="tel"
              label="Contact Number"
              placeholder="Enter mobile number of contact person"
              value={form.contactNumber}
              error={errors.contactNumber}
              onChange={handleChange}
            />
            <Field
              id="billablePerson"
              label="Billable Person"
              placeholder="Enter full name of billable person"
              value={form.billablePerson}
              error={errors.billablePerson}
              onChange={handleChange}
            />
            <Field
              id="billingEmail"
              type="email"
              label="Billing Email"
              placeholder="Enter billing email"
              value={form.billingEmail}
              error={errors.billingEmail}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="h-14 w-full max-w-[360px] rounded-none bg-[#6b1fa8] text-xl font-normal hover:bg-[#5f1a96]"
          >
            View Proposal
            <span className="ml-5">--&gt;</span>
          </Button>
        </div>
      </form>
    </section>
  );
}
