"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Button from "@/src/components/atoms/button";
import SignatureField from "@/src/features/client/contracts/components/signature-field";
import { signContract } from "@/src/features/client/contracts/services/contracts-api";
import { CampaignContract } from "@/src/features/creator/workspace/services/getCampaignSetup";

interface ContractSigningPanelProps {
  contract?: CampaignContract;
  onSigned?: () => void;
}

export function ContractSigningPanel({ contract, onSigned }: ContractSigningPanelProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signatureDataUrl, setSignatureDataUrl] = useState("");
  const [initialsDataUrl, setInitialsDataUrl] = useState("");

  const signingMutation = useMutation({
    mutationFn: () => {
      if (!contract) throw new Error("Contract is missing");
      return signContract(contract.public_id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        signatureDataUrl,
        initialsDataUrl,
        signerRole: "CREATOR",
      });
    },
    onSuccess: () => {
      toast.success("Contract signed successfully.");
      onSigned?.();
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Unable to sign contract."),
  });

  const canSign =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    Boolean(signatureDataUrl) &&
    Boolean(initialsDataUrl) &&
    !signingMutation.isPending;

  return (
    <section className="flex flex-col gap-6 w-full h-full max-w-4xl bg-white rounded border border-[#d8d4cb] p-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl text-foreground font-normal">Sign Contract</h2>
        <p className="text-sm text-[#78746e]">
          Please review the contract details. Once you are ready, confirm your name, initials, and signature to formally accept the terms.
        </p>
      </div>

      <Card className="rounded-none p-6 space-y-6 shadow-none">
        <span className="text-[#78746e] font-medium text-lg">Adopt Your Signature</span>
        <div className="flex gap-6">
          <Field className="flex flex-col gap-1.5 flex-1">
            <FieldLabel htmlFor="creator-firstname-input">First Name</FieldLabel>
            <Input
              id="creator-firstname-input"
              placeholder="Enter First Name"
              className="border-[#78746e]"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </Field>
      
          <Field className="flex flex-col gap-1.5 flex-1">
            <FieldLabel htmlFor="creator-lastname-input">Last Name</FieldLabel>
            <Input
              id="creator-lastname-input"
              placeholder="Enter Last Name"
              className="border-[#78746e]"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </Field>
        </div>

        <div className="flex flex-col md:flex-row gap-8 rounded-lg border border-input/40 p-4 bg-[#f9f9f9]">
          <SignatureField
            label="Signed by:"
            id={`sig-${contract?.public_id || 'unknown'}`}
            className="w-full md:w-64 bg-white rounded"
            height={50}
            onChange={setSignatureDataUrl}
          />
          <SignatureField
            label="Initials:"
            id={`init-${contract?.public_id || 'unknown'}`}
            className="w-full md:w-48 bg-white rounded"
            height={50}
            onChange={setInitialsDataUrl}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="button"
            className="h-11 w-48 text-lg font-medium"
            disabled={!canSign}
            onClick={() => signingMutation.mutate()}
          >
            {signingMutation.isPending ? "Signing..." : "Sign Contract"}
          </Button>
        </div>
      </Card>
    </section>
  );
}
