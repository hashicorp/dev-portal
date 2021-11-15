import React from 'react'
import HashiHead from '@hashicorp/react-head'
import HashiStackMenu from '@hashicorp/react-hashi-stack-menu'
import AlertBanner from '@hashicorp/react-alert-banner'
import Min100Layout from '@hashicorp/react-min-100-layout'
import useProductMeta, { Products } from '@hashicorp/platform-product-meta'
import createConsentManager from '@hashicorp/react-consent-manager/loader'
// product-specific layout elements
import Footer from 'components/_proxied-dot-io/boundary/footer'
import ProductSubnav from 'components/_proxied-dot-io/boundary/subnav'
import productData from 'data/boundary.json'

const { ConsentManager, openConsentManager } = createConsentManager({
  preset: 'oss',
})

function BoundaryIoLayout({
  children,
}: {
  /** Page contents to render in the layout */
  children: React.ReactNode
}): React.ReactElement {
  const { themeClass } = useProductMeta(productData.name as Products)

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
        <HashiStackMenu onPanelChange={() => null} />
        <ProductSubnav />
        <div className={themeClass}>{children}</div>
      </Min100Layout>
      <ConsentManager />
    </>
  )
}

export default BoundaryIoLayout
