import { API_BASE_URL } from "@/src/config/api";
import { parseApiError } from "@/src/features/auth/services/users-api";
import type { CampaignSetupDetails } from "@/src/features/creator/proposals/types/campaign-setup-response.types";

export interface SignContractPayload {
  signatureDataUrl: string;
  initialsDataUrl: string;
  signerRole: "CLIENT" | "CREATOR";
}

export interface ContractStatus {
  public_id: string;
  creator_signed: boolean;
  client_signed: boolean;
  effective_date: string | null;
}

export interface ContractSignature {
  contract_id: string;
  signer_role: "CLIENT" | "CREATOR";
  signature_url: string;
  initials_url: string;
  signed_at: string;
}

export interface UnsignedContractPreview {
  details: CampaignSetupDetails;
  creatorName: string;
}

export async function getUnsignedContractPreview(
  proposalPublicId: string,
): Promise<UnsignedContractPreview> {
  const setupResponse = await fetch(
    `${API_BASE_URL}/campaign-setup/proposal/${encodeURIComponent(proposalPublicId)}`,
    { credentials: "include" },
  );
  if (!setupResponse.ok) {
    throw new Error(await parseApiError(setupResponse, "Unable to load contract details."));
  }
  const details = (await setupResponse.json()) as CampaignSetupDetails;
  const creatorResponse = await fetch(
    `${API_BASE_URL}/users/${encodeURIComponent(details.campaign.ugc_creator_id)}`,
    { credentials: "include" },
  );
  if (!creatorResponse.ok) {
    throw new Error(await parseApiError(creatorResponse, "Unable to load creator details."));
  }
  const creator = (await creatorResponse.json()) as {
    first_name: string;
    last_name: string;
  };
  return {
    details,
    creatorName: `${creator.first_name} ${creator.last_name}`.trim(),
  };
}

export async function getContractStatus(contractPublicId: string): Promise<ContractStatus> {
  const response = await fetch(`${API_BASE_URL}/contracts/${contractPublicId}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to load contract status."));
  }
  return response.json();
}

export async function signContract(
  contractPublicId: string,
  payload: SignContractPayload,
) {
  const formData = new FormData();
  formData.append("signerRole", payload.signerRole);
  
  if (payload.signatureDataUrl) {
    const signatureBlob = await fetch(payload.signatureDataUrl).then((res) => res.blob());
    formData.append("signature", signatureBlob, "signature.png");
  }

  if (payload.initialsDataUrl) {
    const initialsBlob = await fetch(payload.initialsDataUrl).then((res) => res.blob());
    formData.append("initials", initialsBlob, "initials.png");
  }

  const response = await fetch(
    `${API_BASE_URL}/contracts/sign/${contractPublicId}`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to sign contract."));
  }

  return response.json();
}

export async function getContractSignatures(
  contractPublicId: string,
): Promise<ContractSignature[]> {
  const response = await fetch(
    `${API_BASE_URL}/contracts/signatures/${contractPublicId}`,
    { credentials: "include" },
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to fetch signatures."));
  }

  return response.json();
}
