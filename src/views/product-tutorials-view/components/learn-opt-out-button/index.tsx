import { useState } from 'react'
import { useRouter } from 'next/router'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import '@reach/dialog/styles.css'
import Button from 'components/button'
import OptOutForm from '../opt-out-form'
import Dialog from '../opt-out-dialog'

/**
 * ALSO, this should only render if the cookie is present
 */

// const LEARN_BASE_URL = 'https://learn.hashicorp.com/'
const LEARN_BASE_URL =
  'https://learn-git-ksspike-opt-in-redirects-hashicorp.vercel.app' // FOR TESTING PURPOSES @TODO remove before merging

export function OptOutButton() {
  const router = useRouter()
  const url = getLearnRedirectPath(router.asPath)
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
          redirectUrl={url}
          onDismiss={closeDialog}
          platform="learn"
        />
      </Dialog>
    </div>
  )
}

function getLearnRedirectPath(currentPath: string) {
  const originalUrl = new URL(currentPath, LEARN_BASE_URL)
  const finalUrl = new URL(LEARN_BASE_URL)
  finalUrl.searchParams.set('betaOptOut', 'true')
  finalUrl.searchParams.set('path', originalUrl.pathname)

  return finalUrl.toString()
}
