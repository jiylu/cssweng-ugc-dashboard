export function getNotificationDestination(title: string, isClient: boolean) {
  const normalizedTitle = title.toLowerCase()

  if (normalizedTitle.includes("proposal")) {
    return isClient ? "/dashboard" : "/proposals/submitted"
  }

  if (
    normalizedTitle.includes("asset") ||
    normalizedTitle.includes("payment") ||
    normalizedTitle.includes("contract") ||
    normalizedTitle.includes("campaign setup")
  ) {
    return isClient ? "/dashboard" : "/campaigns"
  }

  return isClient ? "/dashboard" : "/creator-dashboard"
}
