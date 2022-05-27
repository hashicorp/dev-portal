import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { v4 as uuid } from 'uuid'
import { IconSignOut16 } from '@hashicorp/flight-icons/svg-react/sign-out-16'
import '@reach/dialog/styles.css'
import { safeAnalyticsTrack } from 'lib/analytics'
import Button from 'components/button'
import Dialog from 'components/dialog'
import OptOutForm from './components/opt-out-form'
import {
  PlatformOptionRedirectData,
  OptInOutProps,
  isOptInPlatformOption,
} from './types'
import {
  getIoRedirectPath,
  getLearnRedirectPath,
  postFormData,
  makeBetaWelcomeToast,
} from './helpers'
import { OptOutFormState } from './components/opt-out-form/types'

// Could these go in the config? or I could source the base urls elsewhere
export const PLATFORM_OPTIONS: PlatformOptionRedirectData = {
  learn: {
    base_url: 'https://learn-git-ksspike-opt-in-redirects-hashicorp.vercel.app', // FOR TESTING PURPOSES NEED TO UPDATE for - 'https://learn.hashicorp.com/'
    getRedirectPath: getLearnRedirectPath,
    cookieKey: 'learn-beta-opt-in',
    cookieAnalyticsKey: 'learn-beta-opt-in-tracked',
  },
  'waypoint-io': {
    base_url: 'https://www.waypointproject.io/',
    getRedirectPath(path) {
      return this.base_url + getIoRedirectPath(path)
    },
    cookieKey: 'waypoint-io-beta-opt-in',
    cookieAnalyticsKey: 'waypoint-io-beta-opt-in-tracked',
  },
  'vault-io': {
    base_url: 'https://www.vaultproject.io/',
    getRedirectPath(path) {
      return this.base_url + getIoRedirectPath(path)
    },
    cookieKey: 'vault-io-beta-opt-in',
    cookieAnalyticsKey: 'vault-io-beta-opt-in-tracked',
  },
}

export default function OptInOut({ platform, redirectPath }: OptInOutProps) {
  // fire toast, render button, etc
  const router = useRouter()
  const [showDialog, setShowDialog] = useState(false)
  const optedIn = Cookies.get(PLATFORM_OPTIONS[platform].cookieKey)

  const openDialog = () => setShowDialog(true)
  const closeDialog = () => setShowDialog(false)
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
        opt_out_page_url: router.asPath,
      })
      // Cookies.remove(PLATFORM_OPTIONS[platform].cookieKey)
      // Cookies.remove(PLATFORM_OPTIONS[platform].cookieAnalyticsKey)
      // safeAnalyticsTrack('Beta Opted Out', {
      //   bucket: platform,
      // })
      // window.location.assign(url)
    },
    [platform, url]
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
  }, [optInFrom, handleOptOut])

  // Return early if not opted in
  // if (optedIn !== 'true') {
  //   return null
  // }

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
