import Subnav from '@hashicorp/react-subnav'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { productSlug, productName } from 'data/metadata'
import navigationWaypoint from '../../site-specific/navigation.waypoint'
import navigationConsul from '../../site-specific/navigation.consul'

const navigationDict = {
  waypoint: navigationWaypoint,
  consul: navigationConsul,
}

const navigationJs = navigationDict[productSlug]

export default function ProductSubnav() {
  const router = useRouter()
  return (
    <Subnav
      titleLink={{
        text: productName,
        url: '/',
      }}
      ctaLinks={[
        {
          text: 'GitHub',
          url: `https://www.github.com/hashicorp/${productSlug}`,
        },
        {
          text: 'Download',
          url: '/downloads',
        },
      ]}
      currentPath={router.asPath}
      menuItemsAlign="right"
      menuItems={navigationJs}
      constrainWidth
      Link={Link}
    />
  )
}
