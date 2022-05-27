import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { v4 as uuid } from 'uuid'
import '@reach/dialog/styles.css'
import { safeAnalyticsTrack } from 'lib/analytics'
import { OptInOutProps, isOptInPlatformOption } from './types'
import { PLATFORM_OPTIONS, postFormData, makeBetaWelcomeToast } from './helpers'
import { OptOutFormState } from './components/opt-out-form/types'
import { OptOutButtonAndDialog } from './components/opt-out-button-and-dialog'

export default function OptInOutController({
  platform,
  redirectPath,
}: OptInOutProps) {
  // fire toast, render button, etc
  const router = useRouter()
  const optedIn = Cookies.get(PLATFORM_OPTIONS[platform].cookieKey)
  const url =
    redirectPath || PLATFORM_OPTIONS[platform].getRedirectPath(router.asPath)

  /**
   * Handle opt out, which is passed to our opt out form,
   * and is also used in our welcome toast.
   */
  const handleOptOut = useCallback(
    async (state: OptOutFormState) => {
      await postFormData({
        segment_anonymous_id: uuid(),
        primary_opt_out_reason: state.optOutReason,
        details: state.optOutDetails,
        opt_out_page_url: new URL(
          router.asPath,
          __config.dev_dot.canonical_base_url
        ).toString(),
      })
      safeAnalyticsTrack('Beta Opted Out', {
        bucket: platform,
      })
      Cookies.remove(PLATFORM_OPTIONS[platform].cookieKey)
      Cookies.remove(PLATFORM_OPTIONS[platform].cookieAnalyticsKey)
      window.location.assign(url)
    },
    [platform, url, router.asPath]
  )

  /**
   * If there's an 'optInFrom' query parameter,
   * make some welcome toast
   */
  const optInFrom = router.query?.optInFrom
  useEffect(() => {
    if (typeof optInFrom == 'string' && isOptInPlatformOption(optInFrom)) {
      makeBetaWelcomeToast(optInFrom)
    }
  }, [optInFrom])

  // Return early if not opted in
  if (optedIn !== 'true') {
    return null
  }

  return <OptOutButtonAndDialog handleOptOut={handleOptOut} />
}
