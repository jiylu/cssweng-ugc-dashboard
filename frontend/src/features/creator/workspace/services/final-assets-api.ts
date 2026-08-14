import JSZip from "jszip"
import { API_BASE_URL } from "@/src/config/api"
import { parseApiError } from "@/src/features/auth/services/users-api"

export interface FinalAsset {
  public_id: string
  file_url: string
  created_at: string
}

export interface FinalAssetsForDeliverable {
  deliverablePublicId: string
  finalAssets: FinalAsset[]
}

export type FinalAssetsForCampaign = Record<
  string,
  FinalAssetsForDeliverable
>

export async function getFinalAssetsForCampaign(
  campaignPublicId: string,
): Promise<FinalAssetsForCampaign> {
  const response = await fetch(
    `${API_BASE_URL}/final-assets/campaign/${encodeURIComponent(campaignPublicId)}`,
    { credentials: "include" },
  )
  if (!response.ok) {
    throw new Error(await parseApiError(response, "Unable to fetch final assets."))
  }
  return response.json()
}

export function uniqueFilename(filename: string, used: Set<string>): string {
  if (!used.has(filename)) {
    used.add(filename)
    return filename
  }
  const dot = filename.lastIndexOf(".")
  const base = dot > 0 ? filename.slice(0, dot) : filename
  const ext = dot > 0 ? filename.slice(dot) : ""
  let candidate = `${base} (1)${ext}`
  let counter = 2
  while (used.has(candidate)) {
    candidate = `${base} (${counter})${ext}`
    counter++
  }
  used.add(candidate)
  return candidate
}

export async function downloadFinalAssetsAsZip(
  assets: FinalAsset[],
  zipName = "final-assets.zip",
): Promise<number> {
  const zip = new JSZip()
  const used = new Set<string>()
  let downloaded = 0

  for (const asset of assets) {
    try {
      const response = await fetch(asset.file_url)
      if (!response.ok) continue
      const blob = await response.blob()
      const filename = uniqueFilename(
        asset.file_url.split("/").pop() || `asset-${asset.public_id}`,
        used,
      )
      zip.file(filename, blob)
      downloaded++
    } catch {
      // skip files that failed to fetch; zip the rest
    }
  }

  if (downloaded === 0) return 0

  const blob = await zip.generateAsync({ type: "blob" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = zipName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)

  return downloaded
}
