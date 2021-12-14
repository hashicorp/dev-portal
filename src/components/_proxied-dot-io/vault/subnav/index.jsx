import { useEffect, useState } from 'react'
import Subnav from '@hashicorp/react-subnav'
import { useRouter } from 'next/router'
import productData from 'data/vault.json'

export default function ProductSubnav() {
  const router = useRouter()
  const [currentPath, setCurrentPath] = useState()

  useEffect(() => {
    setCurrentPath(router.asPath)
  }, [router.asPath])


  return (
    <Subnav
      className="g-product-subnav"
      hideGithubStars={true}
      titleLink={{
        text: 'vault',
        url: '/',
      }}
      ctaLinks={[
        {
          text: 'GitHub',
          url: 'https://www.github.com/hashicorp/vault',
        },
        {
          text: 'Try Cloud',
          url:
            'https://portal.cloud.hashicorp.com/sign-up?utm_source=vault_io&utm_content=top_nav_vault',
        },
        {
          text: 'Download',
          url: '/downloads',
        },
      ]}
      currentPath={currentPath}
      menuItems={productData.subnavItems}
      menuItemsAlign="right"
      constrainWidth
      matchOnBasePath
    />
  )
}
