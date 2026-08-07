import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Button from "@/src/components/atoms/button";
import SignatureField from "./signature-field";

interface SignContractModalProps {
  id: string
}

export default function SignContractModal({ id }: SignContractModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="h-11 w-full text-lg font-medium"
        >
          Accept and Sign Contract
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-xl max-w-3xl bg-[#f2f0ea]">
        <DialogHeader>
          <DialogTitle
            className="text-[#6b1fa8] text-xl font-normal"
          >
            Adopt Your Signature
          </DialogTitle>

          <Card
            className="rounded-none p-3.5"
          >
            <span className="text-[#78746e] font-light">Confirm your name, initials, and signature</span>
            <div className="flex gap-6">
              <Field className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="firstname-input">First Name</FieldLabel>
                <Input
                  id="firstname-input"
                  placeholder="Enter First Name"
                  className="w-64 border-[#78746e]"
                />
              </Field>
          
              <Field className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="lastname-input">Last Name</FieldLabel>
                <Input
                  id="lastname-input"
                  placeholder="Enter Last Name"
                  className="w-64 border-[#78746e]"
                />
              </Field>


            </div>

            <div className="flex gap-8 rounded-lg border border-input/40 p-4">
              <SignatureField
                label="Signed by:"
                id={id}
                className="w-64"
                height={50}
              />
              <SignatureField
                label="DS"
                id="ST" // gawin nalang dynamic wait
                height={50}
                className="w-24"
              />
            </div>

            <p className="text-[#545454] font-light">
              By selecting Adopt and Sign, I agree that the signature and initials will be the electronic representation
              of my signature and initials for all purposes when I (or my agent) use them on documents,
              including legally binding contracts.
            </p>

            <div className="flex flex-row gap-2">
              <Button
                className="h-10 w-45 text-lg font-medium cursor-pointer"
              >
                Adopt and Sign
              </Button>
              <Button
                variant="outline"
                className="h-10 w-30 rounded-none border-[#d8d4cb] bg-white text-lg font-normal text-[#7b7771] cursor-pointer"
              >
                Cancel
              </Button>
            </div>
            
          </Card>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}