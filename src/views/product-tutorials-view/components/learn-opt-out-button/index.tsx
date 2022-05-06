import { useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import '@reach/dialog/styles.css'
import Button from 'components/button'
import OptOutForm from '../opt-out-form'
import Dialog from '../opt-out-dialog'
import { OptInPlatformOption } from 'pages/_middleware'

// const LEARN_BASE_URL = 'https://learn.hashicorp.com/'

type PlatformOptionsType = Record<
  OptInPlatformOption,
  {
    base_url: string
    getRedirectPath: (currentPath?: string) => string
    cookieKey: string
  }
>

// Could these go in the config? or I could source the base urls elsewhere
const PLATFORM_OPTIONS: PlatformOptionsType = {
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

interface OptInOutProps {
  platform: OptInPlatformOption
}

export function OptInOut({ platform }: OptInOutProps) {
  // fire toast, render button, etc
  const router = useRouter()
  const optedIn = Cookies.get(PLATFORM_OPTIONS[platform].cookieKey)
  if (optedIn !== 'true') {
    return null
  }

  console.log({ router }, router.pathname)
  const url = PLATFORM_OPTIONS[platform].getRedirectPath(router.asPath)
  // @TODO - check query, if 'optInFrom' is there, fire toast

  return <OptOutButtonWithDialog redirectUrl={url} />
}

interface OptOutButtonWithDialogProps {
  redirectUrl: string
}

export function OptOutButtonWithDialog({
  redirectUrl,
}: OptOutButtonWithDialogProps) {
  const [showDialog, setShowDialog] = useState(false)
  const openDialog = () => setShowDialog(true)
  const closeDialog = () => setShowDialog(false)
  return (
    <div>
      <Button
        color="tertiary"
        text="Leave Developer Beta"
        icon={<IconExternalLink16 />}
        iconPosition="trailing"
        onClick={openDialog}
      />
      <Dialog onDismiss={closeDialog} isOpen={showDialog} label="Opt out form">
        <OptOutForm
          redirectUrl={redirectUrl}
          onDismiss={closeDialog}
          platform="learn"
        />
      </Dialog>
    </div>
  )
}

function getLearnRedirectPath(currentPath: string) {
  const originalUrl = new URL(currentPath, PLATFORM_OPTIONS['learn'].base_url)
  const finalUrl = new URL(PLATFORM_OPTIONS['learn'].base_url)
  finalUrl.searchParams.set('betaOptOut', 'true')
  finalUrl.searchParams.set('path', originalUrl.pathname)

  return finalUrl.toString()
}
