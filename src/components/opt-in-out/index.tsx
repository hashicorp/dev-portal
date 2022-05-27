import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { v4 as uuid } from 'uuid'
import { IconSignOut16 } from '@hashicorp/flight-icons/svg-react/sign-out-16'
import '@reach/dialog/styles.css'
import { safeAnalyticsTrack } from 'lib/analytics'
import { OptInOutProps, isOptInPlatformOption } from './types'
import { PLATFORM_OPTIONS, postFormData, makeBetaWelcomeToast } from './helpers'
import OptOutForm from './components/opt-out-form'
import { OptOutFormState } from './components/opt-out-form/types'
import Button from 'components/button'
import Dialog from 'components/dialog'

export default function OptInOut({ platform, redirectPath }: OptInOutProps) {
  // fire toast, render button, etc
  const router = useRouter()
  const optedIn = Cookies.get(PLATFORM_OPTIONS[platform].cookieKey)
  const url =
    redirectPath || PLATFORM_OPTIONS[platform].getRedirectPath(router.asPath)
  const [showDialog, setShowDialog] = useState(false)
  const openDialog = () => setShowDialog(true)
  const closeDialog = () => setShowDialog(false)

  /**
   * Handle opt out, which is passed to our opt out form,
   * and is also used in our welcome toast.
   */
  const handleOptOut = useCallback(
    async (state: OptOutFormState) => {
      try {
        await postFormData({
          segment_anonymous_id: uuid(),
          primary_opt_out_reason: state.optOutReason,
          details: state.optOutDetails,
          opt_out_page_url: new URL(
            router.asPath,
            __config.dev_dot.canonical_base_url
          ).toString(),
        })
      } catch (e) {
        console.error(e)
      }
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

  return (
    <div>
      <Button
        color="tertiary"
        text="Leave Beta"
        icon={<IconSignOut16 />}
        iconPosition="trailing"
        onClick={openDialog}
      />
      <Dialog onDismiss={closeDialog} isOpen={showDialog} label="Opt out form">
        <OptOutForm
          onSubmit={handleOptOut}
          onDismiss={closeDialog}
          platform="learn"
        />
      </Dialog>
    </div>
  )
}
