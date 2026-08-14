import { API_BASE_URL } from "@/src/config/api";
import { parseApiError } from "@/src/features/auth/services/users-api";

export interface SignContractPayload {
  signatureDataUrl: string;
  initialsDataUrl: string;
  signerRole: "CLIENT" | "CREATOR";
}

export interface ContractSignature {
  contract_id: string;
  signer_role: "CLIENT" | "CREATOR";
  signature_url: string;
  initials_url: string;
  signed_at: string;
}

function dataUrlToPng(dataUrl: string, filename: string): File {
  const [metadata, encodedData] = dataUrl.split(",");
  if (!metadata || !encodedData || !metadata.includes("image/png")) {
    throw new Error("Signature and initials must be PNG images.");
  }

  const bytes = Uint8Array.from(atob(encodedData), (character) =>
    character.charCodeAt(0),
  );

  return new File([bytes], filename, { type: "image/png" });
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
