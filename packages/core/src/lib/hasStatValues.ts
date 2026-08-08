/**
 * Returns true if the stats object has at least one non-null/undefined value.
 */
export function hasStatValues(stats: Record<string, unknown> | null | undefined): boolean {
  if (!stats) return false
  return !!(
    stats.stars ||
    stats.forks ||
    stats.downloads ||
    stats.version ||
    stats.upvotes ||
    stats.comments ||
    stats.subscribers ||
    stats.views ||
    stats.latestVideoTitle ||
    stats.formattedRevenue ||
    stats.salesCount ||
    stats.subscriberCount ||
    stats.formattedMRR ||
    stats.orderCount ||
    stats.customerCount ||
    stats.articleCount ||
    stats.totalViews ||
    stats.totalReactions
  )
}
