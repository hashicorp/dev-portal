import { OptInPlatformOption } from 'components/opt-in-out/types'
import { useEffect } from 'react'
import { safeAnalyticsTrack } from 'lib/analytics'
import Cookies from 'js-cookie'
import { PLATFORM_OPTIONS } from 'components/opt-in-out'

/**
 * @TODO fire this opt in tracking once someone consents to tracking
 * and the analytics are made available.
 *
 * I tried to do this with `onAcceptAll` but we'll need to adjust the
 * consent manager itself to try and support this. Deferring for now.
 *
 * We could also set a cookie for whether the tracking has been fired.
 * And if not, make sure to do so.
 */
export function useOptInAnalyticsTracking(platform: OptInPlatformOption) {
  useEffect(() => {
    const optInCookie = Cookies.get(PLATFORM_OPTIONS[platform].cookieKey)
    const hasTrackedOptIn = Cookies.get(
      PLATFORM_OPTIONS[platform].cookieAnalyticsKey
    )

    if (optInCookie && !hasTrackedOptIn) {
      console.log('send data!')
      safeAnalyticsTrack('Beta Opted In', {
        bucket: platform,
      })
      Cookies.set(PLATFORM_OPTIONS[platform].cookieAnalyticsKey)
    }
  }, [platform])
}
