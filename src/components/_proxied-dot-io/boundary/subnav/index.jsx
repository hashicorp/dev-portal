import { useEffect, useState } from 'react'
import Subnav from '@hashicorp/react-subnav'
import { useRouter } from 'next/router'
import subnavItems from '../data/navigation'
import { productSlug } from '../data/metadata'
import Link from 'next/link'

export default function ProductSubnav() {
  const router = useRouter()
  const [currentPath, setCurrentPath] = useState()

  useEffect(() => {
    setCurrentPath(router.asPath)
  }, [router.asPath])

  return (
    <Subnav
      titleLink={{
        text: 'Boundary',
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
      currentPath={currentPath}
      menuItemsAlign="right"
      menuItems={subnavItems}
      constrainWidth
      Link={Link}
      matchOnBasePath
    />
  )
}
