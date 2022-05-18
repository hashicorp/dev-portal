/**
 * Determines whether or not `window.analytics.track` can be invokved.
 */
const canTrackAnalytics = (): boolean => {
  return (
    typeof window !== undefined &&
    window.analytics &&
    window.analytics.track &&
    typeof window.analytics.track === 'function'
  )
}

/**
 * Invokes `window.analytics.track` if it is able to be invokved.
 */
const safeAnalyticsTrack = (
  eventName: string,
  properties: Record<string, unknown>
): void => {
  if (canTrackAnalytics()) {
    window.analytics.track(eventName, properties)
  }
}

export { safeAnalyticsTrack }
