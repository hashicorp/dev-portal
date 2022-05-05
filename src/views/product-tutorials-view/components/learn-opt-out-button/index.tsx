import { useState } from 'react'
import { useRouter } from 'next/router'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import '@reach/dialog/styles.css'
import Button from 'components/button'
import OptOutForm from '../opt-out-form'
import Dialog from '../opt-out-dialog'

// @TODO move this up a level? create an opt-out dir?
// THIS SHOULD ONLY RENDER IF THE OPT IN COOKIE IS SET - true
/**
 * maybe we retain the opt out button slot...
 *
 *
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

// @TODO perhaps move this to learn and just pass the dev dot portal path.
// @TODO remove other extra query params...could be leftover from previous redirects
function getLearnRedirectPath(currentPath: string) {
  // based on url structure /{product}/tutorials/{collection}/{tutorial}
  // @TODO test with ANchor links
  const [, product, , collection, tutorial] = currentPath.split('/')
  let learnPath = product
  const params = new URLSearchParams('betaOptOut=true')

  if (tutorial) {
    // /tutorials/{product}/{tutorial}?in={collection}
    learnPath = ['tutorials', product, tutorial].join('/')
    params.append('in', `${product}/${collection}`)
  } else if (collection) {
    // /collections/{product}/{collection}
    learnPath = ['collections', product, collection].join('/')
  }

  params.append('path', learnPath)

  const url = new URL(`?${params.toString()}`, LEARN_BASE_URL)
  return url.toString()
}
