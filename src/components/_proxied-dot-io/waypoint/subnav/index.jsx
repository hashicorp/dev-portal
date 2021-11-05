import { useEffect, useState } from 'react'
import Subnav from '@hashicorp/react-subnav'
import { useRouter } from 'next/router'
import Link from 'next/link'
import subnavItems from '../data/navigation'
import { productSlug } from '../data/metadata'

export default function ProductSubnav() {
  const router = useRouter()
  const [currentPath, setCurrentPath] = useState()

  useEffect(() => {
    setCurrentPath(router.asPath)
  }, [router.asPath])

  return (
    <Subnav
      titleLink={{
        text: 'Waypoint',
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
      hideGithubStars={true}
      currentPath={currentPath}
      menuItemsAlign="center"
      menuItems={subnavItems}
      constrainWidth
      Link={Link}
      matchOnBasePath
    />
  )
}
