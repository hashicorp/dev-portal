import React from 'react'
import HashiHead from '@hashicorp/react-head'
import HashiStackMenu from '@hashicorp/react-hashi-stack-menu'
import AlertBanner from '@hashicorp/react-alert-banner'
import Min100Layout from '@hashicorp/react-min-100-layout'
import useProductMeta, { Products } from '@hashicorp/platform-product-meta'
import createConsentManager from '@hashicorp/react-consent-manager/loader'
import usePageviewAnalytics from '@hashicorp/platform-analytics'
// product-specific layout elements
import Footer from 'components/_proxied-dot-io/sentinel/Footer'
import ProductSubnav from 'components/_proxied-dot-io/sentinel/subnav'
import productData from 'data/sentinel.json'

const { ConsentManager, openConsentManager } = createConsentManager({
  preset: 'oss',
  segmentWriteKey: productData.analyticsConfig.segmentWriteKey,
})

function SentinelIoLayout({
  children,
}: {
  /** Page contents to render in the layout */
  children: React.ReactNode
}): React.ReactElement {
  usePageviewAnalytics({
    siteId: process.env.NEXT_PUBLIC_FATHOM_SITE_ID_SENTINEL,
    includedDomains: productData.analyticsConfig.includedDomains,
  })
  const { themeClass } = useProductMeta(productData.name as Products)

  return (
    <>
      <HashiHead
        title={productData.metadata.title}
        pageName={productData.metadata.title}
        siteName={productData.metadata.title}
        description={productData.metadata.description}
        image={productData.metadata.image}
        icon={productData.metadata.icon}
      />

      <Min100Layout footer={<Footer openConsentManager={openConsentManager} />}>
        {productData.alertBannerActive && (
          <AlertBanner
            {...productData.alertBanner}
            product={productData.slug as Products}
            hideOnMobile
          />
        )}
        <HashiStackMenu onPanelChange={() => null as $TSFixMe} />
        <ProductSubnav />
        <div className={themeClass}>{children}</div>
      </Min100Layout>
      <ConsentManager />
    </>
  )
}

export default SentinelIoLayout
