import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { IconSignOut16 } from '@hashicorp/flight-icons/svg-react/sign-out-16'
import '@reach/dialog/styles.css'
import Button from 'components/button'
import OptOutForm from './components/opt-out-form'
import Dialog from 'components/dialog'
import { getLearnRedirectPath } from './helpers/get-learn-redirect-path'
import {
  PlatformOptionRedirectData,
  OptInOutProps,
  isOptInPlatformOption,
} from './types'
import { safeAnalyticsTrack } from 'lib/analytics'
import makeBetaWelcomeToast from './helpers/make-beta-welcome-toast'

// Could these go in the config? or I could source the base urls elsewhere
export const PLATFORM_OPTIONS: PlatformOptionRedirectData = {
  learn: {
    base_url: 'https://learn-git-ksspike-opt-in-redirects-hashicorp.vercel.app', // FOR TESTING PURPOSES NEED TO UPDATE for - 'https://learn.hashicorp.com/'
    getRedirectPath: getLearnRedirectPath,
    cookieKey: 'learn-beta-opt-in',
    cookieAnalyticsKey: 'learn-beta-opt-in-tracked',
    cookieHasDismissedToastKey: 'learn-beta-opt-in-has-dismissed-toast',
  },
  'waypoint-io': {
    base_url: 'https://www.waypointproject.io/',
    getRedirectPath: function TODO() {
      return 'test'
    },
    cookieKey: 'waypoint-io-beta-opt-in',
    cookieAnalyticsKey: 'waypoint-io-beta-opt-in-tracked',
    cookieHasDismissedToastKey: 'waypoint-io-beta-opt-in-has-dismissed-toast',
  },
  'vault-io': {
    base_url: 'https://www.vaultproject.io/',
    getRedirectPath: function TODO() {
      return 'test'
    },
    cookieKey: 'vault-io-beta-opt-in',
    cookieAnalyticsKey: 'vault-io-beta-opt-in-tracked',
    cookieHasDismissedToastKey: 'vault-io-beta-opt-in-has-dismissed-toast',
  },
}

export default function OptInOut({ platform, redirectPath }: OptInOutProps) {
  // fire toast, render button, etc
  const router = useRouter()
  const [showDialog, setShowDialog] = useState(false)
  const optedIn = Cookies.get(PLATFORM_OPTIONS[platform].cookieKey)
  const hasDismissedOptInToast = Cookies.get(
    PLATFORM_OPTIONS[platform].cookieHasDismissedToastKey
  )

  const openDialog = () => setShowDialog(true)
  const closeDialog = () => setShowDialog(false)
  const url =
    redirectPath || PLATFORM_OPTIONS[platform].getRedirectPath(router.asPath)

  /**
   * Handle opt out, which is passed to our opt out form,
   * and is also used in our welcome toast.
   */
  const handleOptOut = useCallback(() => {
    // @TODO - handle form submit
    Cookies.remove(PLATFORM_OPTIONS[platform].cookieKey)
    Cookies.remove(PLATFORM_OPTIONS[platform].cookieAnalyticsKey)
    Cookies.remove(PLATFORM_OPTIONS[platform].cookieHasDismissedToastKey)
    safeAnalyticsTrack('Beta Opted Out', {
      bucket: platform,
    })
    window.location.assign(url)
  }, [platform, url])

  /**
   * If there's an 'optInFrom' query parameter,
   * make some welcome toast, which includes an opt-out action
   */
  const optInFrom = router.query?.optInFrom
  const handleDismiss = useCallback(() => {
    Cookies.set(PLATFORM_OPTIONS[platform].cookieHasDismissedToastKey, 'true')
  }, [platform])
  useEffect(() => {
    if (
      !hasDismissedOptInToast &&
      typeof optInFrom == 'string' &&
      isOptInPlatformOption(optInFrom)
    ) {
      makeBetaWelcomeToast(optInFrom, handleDismiss, handleOptOut)
    }
  }, [hasDismissedOptInToast, optInFrom, handleOptOut, handleDismiss])

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
