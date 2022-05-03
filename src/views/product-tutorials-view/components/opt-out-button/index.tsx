import { useRouter } from 'next/router'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import Button from 'components/button'

const LEARN_BASE_URL = 'https://learn.hashicorp.com/'

export function OptOutButton() {
  const router = useRouter()
  // @TODO - format all learn paths, currently this will only work for product tutorial landing pages
  const learnPath = router.pathname.split('/')[0]
  const url = new URL(learnPath + '?betaOptOut=true', LEARN_BASE_URL)
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
