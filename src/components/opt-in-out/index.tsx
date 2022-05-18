import { useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { IconSignOut16 } from '@hashicorp/flight-icons/svg-react/sign-out-16'
import '@reach/dialog/styles.css'
import Button from 'components/button'
import OptOutForm from './components/opt-out-form'
import Dialog from 'components/dialog'
import { getLearnRedirectPath } from './helpers/get-learn-redirect-path'
import { PlatformOptionRedirectData, OptInOutProps } from './types'

// Could these go in the config? or I could source the base urls elsewhere
export const PLATFORM_OPTIONS: PlatformOptionRedirectData = {
  learn: {
    base_url: 'https://learn-git-ksspike-opt-in-redirects-hashicorp.vercel.app', // FOR TESTING PURPOSES NEED TO UPDATE for - 'https://learn.hashicorp.com/'
    getRedirectPath: getLearnRedirectPath,
    cookieKey: 'learn-beta-opt-in',
  },
  'waypoint-io': {
    base_url: 'https://www.waypointproject.io/',
    getRedirectPath: function TODO() {
      return 'test'
    },
    cookieKey: 'waypoint-io-beta-opt-in',
  },
  'vault-io': {
    base_url: 'https://www.vaultproject.io/',
    getRedirectPath: function TODO() {
      return 'test'
    },
    cookieKey: 'vault-io-beta-opt-in',
  },
}

// @TODO - check query, if 'optInFrom' is there, fire welcome toast
export default function OptInOut({ platform, redirectPath }: OptInOutProps) {
  // fire toast, render button, etc
  const router = useRouter()
  const [showDialog, setShowDialog] = useState(false)
  const optedIn = Cookies.get(PLATFORM_OPTIONS[platform].cookieKey)

  // Return early if not opted in
  if (optedIn !== 'true') {
    return null
  }

  const openDialog = () => setShowDialog(true)
  const closeDialog = () => setShowDialog(false)
  const url =
    redirectPath || PLATFORM_OPTIONS[platform].getRedirectPath(router.asPath)

  function handleOptOut() {
    // @TODO - handle form submit
    Cookies.remove(PLATFORM_OPTIONS[platform].cookieKey)
    window.location.assign(url)
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
