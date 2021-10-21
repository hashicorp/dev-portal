import Subnav from '@hashicorp/react-subnav'
import { useRouter } from 'next/router'
import Link from 'next/link'
const subnavItems = [
  {
    text: 'Overview',
    url: '/',
    type: 'inbound',
  },
  'divider',
  {
    text: 'Tutorials',
    url: 'https://learn.hashicorp.com/waypoint',
    type: 'inbound',
  },
  {
    text: 'Docs',
    url: '/docs',
    type: 'inbound',
  },
  {
    text: 'CLI',
    url: '/commands',
    type: 'inbound',
  },
  {
    text: 'Plugins',
    url: '/plugins',
    type: 'inbound',
  },
  {
    text: 'Community',
    url: '/community',
    type: 'inbound',
  },
]

export default function ProductSubnav() {
  const router = useRouter()
  return (
    <Subnav
      titleLink={{
        text: 'Waypoint',
        url: '/',
      }}
      ctaLinks={[
        {
          text: 'GitHub',
          url: `https://www.github.com/hashicorp/waypoint`,
        },
        {
          text: 'Download',
          url: '/downloads',
        },
      ]}
      currentPath={router.asPath}
      menuItemsAlign="right"
      menuItems={subnavItems}
      constrainWidth
      Link={Link}
      matchOnBasePath
    />
  )
}
