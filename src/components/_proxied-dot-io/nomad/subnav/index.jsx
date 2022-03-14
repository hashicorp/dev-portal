import { useEffect, useState } from 'react'
import Subnav from '@hashicorp/react-subnav'
import productData from 'data/nomad'
import { useRouter } from 'next/router'

export default function NomadSubnav() {
  const router = useRouter()
  const [currentPath, setCurrentPath] = useState()

  useEffect(() => {
    setCurrentPath(router.asPath)
  }, [router.asPath])

  return (
    <Subnav
      titleLink={{
        text: 'nomad',
        url: '/',
      }}
      ctaLinks={[
        { text: 'GitHub', url: 'https://www.github.com/hashicorp/nomad' },
        { text: 'Download', url: '/downloads' },
      ]}
      currentPath={currentPath}
      menuItemsAlign="right"
      menuItems={productData.subnavItems}
      constrainWidth
      matchOnBasePath
    />
  )
}
