import { useEffect, useState } from 'react'
import Subnav from '@hashicorp/react-subnav'
import productData from 'data/vagrant'
import { useRouter } from 'next/router'

export default function VagrantSubnav() {
  const router = useRouter()
  const [, setCurrentPath] = useState()

  useEffect(() => {
    setCurrentPath(router.asPath)
  }, [router.asPath])

  return (
    <Subnav
      titleLink={{
        text: 'vagrant',
        url: '/',
      }}
      ctaLinks={[
        { text: 'GitHub', url: 'https://www.github.com/hashicorp/vagrant' },
        { text: 'Download', url: '/downloads' },
      ]}
      currentPath={router.pathname}
      menuItemsAlign="right"
      menuItems={productData.subnavItems}
      constrainWidth
      matchOnBasePath
    />
  )
}
