import { useRouter } from 'next/router'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import Button from 'components/button'

// @TODO move this up a level? create an opt-out dir?
// THIS SHOULD ONLY RENDER IF THE OPT IN COOKIE IS SET - true
/**
 * maybe we retain the opt out button slot...
 */

// const LEARN_BASE_URL = 'https://learn.hashicorp.com/'
const LEARN_BASE_URL =
  'https://learn-git-ksspike-opt-in-redirects-hashicorp.vercel.app' // FOR TESTING PURPOSES @TODO remove before merging

export function OptOutButton() {
  const router = useRouter()
  const url = getLearnRedirectPath(router.asPath)
  // @TODO this should open a modal
  return (
    <Button
      color="tertiary"
      text="Leave Developer Beta"
      icon={<IconExternalLink16 />}
      iconPosition="trailing"
      onClick={() => window.location.assign(url)}
    />
  )
}

function getLearnRedirectPath(currentPath: string) {
  // based on url structure /{product}/tutorials/{collection}/{tutorial}
  const [, product, , collection, tutorial] = currentPath.split('/')
  let learnPath = product
  const params = new URLSearchParams('betaOptOut=true')

  if (tutorial) {
    // /tutorials/{product}/{tutorial}?in={collection}
    learnPath = ['tutorials', product, tutorial].join('/')
    params.append('in', collection)
  } else if (collection) {
    // /collections/{product}/{collection}
    learnPath = ['collections', product, collection].join('/')
  }

  const url = new URL(learnPath + `?${params.toString()}`, LEARN_BASE_URL)
  console.log(url.toString())
  return url.toString()
}
