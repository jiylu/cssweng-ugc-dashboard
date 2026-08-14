export function filenameFromUrl(url?: string): string {
  if (!url) return "Media Asset"
  try {
    const segment = url.split("/").pop() ?? ""
    return decodeURIComponent(segment) || "Media Asset"
  } catch {
    return "Media Asset"
  }
}
