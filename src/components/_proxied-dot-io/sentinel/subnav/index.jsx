import Subnav from '@hashicorp/react-subnav'
import productData from 'data/sentinel'
import { useRouter } from 'next/router'

export default function SentinelSubnav() {
  const router = useRouter()
  return (
    <Subnav
      titleLink={{
        text: 'Sentinel',
        url: '/',
      }}
      ctaLinks={[{ text: 'Download', url: '/sentinel/downloads' }]}
      currentPath={router.asPath}
      menuItemsAlign="right"
      menuItems={productData.subnavItems}
      constrainWidth
    />
  )
}
