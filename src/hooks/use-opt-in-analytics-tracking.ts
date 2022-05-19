import { OptInPlatformOption } from 'components/opt-in-out/types'
import { useEffect } from 'react'
import { canTrackAnalytics } from 'lib/analytics'
import Cookies from 'js-cookie'
import { PLATFORM_OPTIONS } from 'components/opt-in-out'

/**
 * This hook sends a track event when the opt in cookie for a certain
 * platform is present. It creates a new 'tracked' cookie so that multiple
 * events aren't sent per user.
 */
export const DAYS_UNTIL_OPT_IN_EXPIRE = 180

export function useOptInAnalyticsTracking(platform: OptInPlatformOption) {
  useEffect(() => {
    const optInCookie = Cookies.get(PLATFORM_OPTIONS[platform].cookieKey)
    const hasTrackedOptIn = Cookies.get(
      PLATFORM_OPTIONS[platform].cookieAnalyticsKey
    )

    if (optInCookie && !hasTrackedOptIn) {
      if (canTrackAnalytics()) {
        analytics.track('Beta Opted In', {
          bucket: platform,
        })
        Cookies.set(PLATFORM_OPTIONS[platform].cookieAnalyticsKey, 'true', {
          expires: DAYS_UNTIL_OPT_IN_EXPIRE,
        })
      }
    }
  })
  //^^^^ Note: we could update the deps here to limit the amount this runs
  // Currently leaving this to run on every render so that we can capture
  // accurate tracks between pages such as tutorial and docs views, feel free to update
}
