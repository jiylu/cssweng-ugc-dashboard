import { API_BASE_URL } from "@/src/config/api";
import { parseApiError } from "@/src/features/auth/services/users-api";

export interface SignContractPayload {
  firstName: string;
  lastName: string;
  signatureDataUrl: string;
  initialsDataUrl: string;
  signerRole: "CLIENT" | "CREATOR";
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
