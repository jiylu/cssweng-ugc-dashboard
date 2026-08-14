const LOCAL_DRAFT_PREFIX = "written-asset-draft:"

export function getWrittenAssetLocalDraft(
  deliverableItemPublicId: string,
): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(`${LOCAL_DRAFT_PREFIX}${deliverableItemPublicId}`)
}

export function saveWrittenAssetLocalDraft(
  deliverableItemPublicId: string,
  content: string,
): void {
  if (typeof window === "undefined") return
  localStorage.setItem(
    `${LOCAL_DRAFT_PREFIX}${deliverableItemPublicId}`,
    content,
  )
}

export function clearWrittenAssetLocalDraft(
  deliverableItemPublicId: string,
): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(`${LOCAL_DRAFT_PREFIX}${deliverableItemPublicId}`)
}
