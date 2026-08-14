"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Button from "@/src/components/atoms/button";
import SignatureField from "./signature-field";
import { signContract } from "../services/contracts-api";
import { acceptProposal } from "../../proposals/services/proposals-api";

interface SignContractModalProps {
  contractPublicId: string;
  proposalPublicId?: string;
}

export default function SignContractModal({ contractPublicId, proposalPublicId }: SignContractModalProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signatureDataUrl, setSignatureDataUrl] = useState("");
  const [initialsDataUrl, setInitialsDataUrl] = useState("");
  const signingMutation = useMutation({
    mutationFn: async () => {
      try {
        await signContract(contractPublicId, {
          signatureDataUrl,
          initialsDataUrl,
          signerRole: "CLIENT",
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        const clientAlreadySigned =
          /already signed by (?:the )?client/i.test(message);

        if (!clientAlreadySigned) throw error;
        if (!proposalPublicId) {
          throw new Error(
            "You have already signed this contract. It is awaiting the creator’s signature.",
          );
        }
      }

      if (proposalPublicId) {
        await acceptProposal(proposalPublicId);
      }
    },
    onSuccess: () => {
      toast.success("Contract signed and proposal accepted.");
      router.push("/dashboard");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Unable to sign contract."),
  });
  const canSign =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    Boolean(signatureDataUrl) &&
    Boolean(initialsDataUrl);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="h-11 w-full text-lg font-medium"
        >
          Accept and Sign Contract
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] min-w-3xl max-w-5xl overflow-y-auto bg-[#f2f0ea]">
        <DialogHeader>
          <DialogTitle
            className="text-xl font-normal text-[#6b1fa8]"
          >
            Adopt Your Signature
          </DialogTitle>
        </DialogHeader>

        <Card
          className="flex flex-col gap-4 rounded-none p-4"
        >
            <span className="text-[#78746e] font-light">Confirm your name, initials, and signature</span>
            <div className="flex gap-6">
              <Field className="flex flex-1 flex-col gap-1.5">
                <FieldLabel htmlFor="firstname-input">First Name</FieldLabel>
                <Input
                  id="firstname-input"
                  placeholder="Enter First Name"
                  className="w-full border-[#78746e]"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </Field>
          
              <Field className="flex flex-1 flex-col gap-1.5">
                <FieldLabel htmlFor="lastname-input">Last Name</FieldLabel>
                <Input
                  id="lastname-input"
                  placeholder="Enter Last Name"
                  className="w-full border-[#78746e]"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </Field>


            </div>

            <div className="flex gap-8 rounded-lg border border-input/40 p-6">
              <SignatureField
                label="Signed by:"
                id={contractPublicId}
                className="flex-1"
                height={120}
                onChange={setSignatureDataUrl}
              />
              <SignatureField
                label="Initials"
                height={120}
                className="w-48"
                onChange={setInitialsDataUrl}
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
                disabled={!canSign || signingMutation.isPending}
                onClick={() => signingMutation.mutate()}
              >
                {signingMutation.isPending ? "Signing..." : "Adopt and Sign"}
              </Button>
              <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-10 w-30 rounded-none border-[#d8d4cb] bg-white text-lg font-normal text-[#7b7771] cursor-pointer"
              >
                Cancel
              </Button>
              </DialogClose>
            </div>
            
          </Card>
      </DialogContent>
    </Dialog>
  )
}
