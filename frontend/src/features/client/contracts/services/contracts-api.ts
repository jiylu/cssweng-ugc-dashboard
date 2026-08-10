import { API_BASE_URL } from "@/src/config/api";
import { parseApiError } from "@/src/features/auth/services/users-api";

export interface SignContractPayload {
  firstName: string;
  lastName: string;
  signatureDataUrl: string;
  initialsDataUrl: string;
}

export async function signContract(
  contractPublicId: string,
  payload: SignContractPayload,
) {
  const response = await fetch(
    `${API_BASE_URL}/contracts/sign/${contractPublicId}`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to sign contract."));
  }

  return response.json();
}
