import React from 'react'
import HashiHead from '@hashicorp/react-head'
import AlertBanner from '@hashicorp/react-alert-banner'
import Min100Layout from '@hashicorp/react-min-100-layout'
import useProductMeta, { Products } from '@hashicorp/platform-product-meta'
import createConsentManager from '@hashicorp/react-consent-manager/loader'
// product-specific layout elements
import Footer from 'components/_proxied-dot-io/vault/footer-with-props'
import ProductSubnav from 'components/_proxied-dot-io/vault/subnav'
import productData from 'data/vault.json'
import query from './query.graphql'

const { ConsentManager, openConsentManager } = createConsentManager({
  preset: 'oss',
})

function VaultIoLayout({ children, data }: Props): React.ReactElement {
  const { themeClass } = useProductMeta(productData.name as Products)
  const { useCaseNavItems } = data

  return (
    <>
      <HashiHead
        title={productData.metadata.title}
        siteName={productData.metadata.title}
        description={productData.metadata.description}
        image={productData.metadata.image}
        icon={productData.metadata.icon}
      >
        <meta
          name="og:title"
          property="og:title"
          content={productData.metadata.title}
        />
        <meta
          name="og:description"
          property="og:title"
          content={productData.metadata.description}
        />
      </HashiHead>

      <Min100Layout footer={<Footer openConsentManager={openConsentManager} />}>
        {productData.alertBannerActive && (
          <AlertBanner
            {...productData.alertBanner}
            product={productData.slug as Products}
            hideOnMobile
          />
        )}
        <ProductSubnav
          menuItems={[
            { text: 'Overview', url: '/' },
            {
              text: 'Use Cases',
              submenu: useCaseNavItems
                .sort((a, b) => a.text.localeCompare(b.text))
                .map((item) => {
                  return {
                    text: item.text,
                    url: `/use-cases/${item.url}`,
                  }
                }),
            },
            {
              text: 'Enterprise',
              url: 'https://www.hashicorp.com/products/vault/enterprise',
            },
            'divider',
            { text: 'Tutorials', url: 'https://learn.hashicorp.com/vault' },
            { text: 'Docs', url: '/docs' },
            { text: 'API', url: '/api-docs' },
            { text: 'Community', url: '/community' },
          ]}
        />
        <div className={themeClass}>{children}</div>
      </Min100Layout>
      <ConsentManager />
    </>
  )
}

VaultIoLayout.rivetParams = {
  query,
  dependencies: [],
}

interface Props {
  children: React.ReactChildren
  data: {
    useCaseNavItems: Array<{ url: string; text: string }>
  }
}

export default VaultIoLayout
