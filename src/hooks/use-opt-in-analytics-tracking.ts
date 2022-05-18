import { useRouter } from 'next/router'
import {
  OptInPlatformOption,
  PlatformOptionTitles,
} from 'components/opt-in-out/types'
import { useEffect } from 'react'
import { safeAnalyticsTrack } from 'lib/analytics'

export function useOptInAnalyticsTracking() {
  const { query } = useRouter()

  useEffect(() => {
    query['optInFrom'] &&
      handleOptInAnalytics(query['optInFrom'] as OptInPlatformOption)
  }, [])
}

/**
 * Fires beta opt in analytics event if the `optInFrom`
 * query param is present.
 */
export function handleOptInAnalytics(platform: OptInPlatformOption) {
  const isValidPlatformOption = Boolean(
    typeof platform === 'string' &&
      Object.keys(PlatformOptionTitles).indexOf(platform) !== -1
  )

  if (isValidPlatformOption) {
    safeAnalyticsTrack('Beta Opted In', {
      bucket: platform,
    })
  }
}
