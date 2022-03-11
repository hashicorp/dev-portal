import { useEffect, useState } from 'react'
import Subnav from '@hashicorp/react-subnav'
import { useRouter } from 'next/router'
import productData from 'data/boundary'
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
          url: `https://www.github.com/hashicorp/${productData.slug}`,
        },
        {
          text: 'Download',
          url: '/downloads',
        },
      ]}
      currentPath={currentPath}
      menuItemsAlign="right"
      menuItems={productData.subnavItems}
      constrainWidth
      Link={Link}
      matchOnBasePath
    />
  )
}
