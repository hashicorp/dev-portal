/**
 * Heap analytics
 *
 * TODO: should we drop window.heap tracking in dev-dot,
 * considering we've got a unified analytics plan around
 * window.analytics?
 */
function trackHeap(event: string, url: string) {
  window.heap?.track(event, { url })
}
function trackHeapStarted(url: string) {
  trackHeap('Video Started', url)
}
function trackHeapEnded(url: string) {
  trackHeap('Video Ended', url)
}

/**
 * video_played event
 *
 * Spec: "analytics/spec/events/video_played.yml"
 */
function videoPlayedEvent({
  video_url,
  video_progress,
}: {
  video_url: string
  video_progress: number
}) {
  if (checkAnalyticsConsent()) {
    window.analytics.track('Video Played', {
      video_url,
      video_progress,
    })
  }
}

/**
 * Determine if window.analytics.track
 * is a function we can call.
 *
 * With consent, window.analytics.track is initialized in our
 * @hashicorp/react-consent-manager component
 * https://github.com/hashicorp/react-components/blob/c69c29bbcb9e2718c6864336326e4ddfb66822ba/packages/consent-manager/load.js#L132
 * https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#track
 *
 * @returns true if window.analytics.track is a function, false otherwise
 */
function checkAnalyticsConsent() {
  return (
    window && window.analytics && typeof window.analytics.track == 'function'
  )
}

/**
 * Generic event context helper
 *
 * Spec: "analytics/spec/meta/context.yml"
 */
function getAnalyticsContext() {
  return {
    page: {
      path: document.location.pathname,
      referrer: document.referrer,
      search: document.location.search,
      title: document.title,
      url: document.location.href,
    },
    userAgent: navigator.userAgent,
    locale: getClientLocale(),
  }
}
/**
 * Get the current locale on the client.
 * For details, see:
 * MDN docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/resolvedOptions
 * StackOverflow answer: https://stackoverflow.com/a/42070353
 */
function getClientLocale() {
  try {
    return Intl.NumberFormat().resolvedOptions().locale
  } catch (err) {
    if (window.navigator.languages) {
      return window.navigator.languages[0]
    } else {
      return window.navigator['userLanguage'] || window.navigator.language
    }
  }
}

export { trackHeapEnded, trackHeapStarted, videoPlayedEvent }
