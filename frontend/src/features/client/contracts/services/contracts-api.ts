import { API_BASE_URL } from "@/src/config/api";
import { parseApiError } from "@/src/features/auth/services/users-api";

export interface SignContractPayload {
  signatureDataUrl: string;
  initialsDataUrl: string;
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
  formData.append("signerRole", "CLIENT");
  formData.append(
    "signature",
    dataUrlToPng(payload.signatureDataUrl, "signature.png"),
  );
  formData.append(
    "initials",
    dataUrlToPng(payload.initialsDataUrl, "initials.png"),
  );

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
