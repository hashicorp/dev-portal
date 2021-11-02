import React from 'react'
import HashiHead from '@hashicorp/react-head'
import HashiStackMenu from '@hashicorp/react-hashi-stack-menu'
import AlertBanner from '@hashicorp/react-alert-banner'
import Min100Layout from '@hashicorp/react-min-100-layout'
import createConsentManager from '@hashicorp/react-consent-manager/loader'
// product-specific layout elements
// TODO: consider abstracting this layout to work for all proxied .ios
import Footer from 'components/_proxied-dot-io/boundary/footer'
import ProductSubnav from 'components/_proxied-dot-io/boundary/subnav'
import headMetadata from './head-metadata.json'

const { ConsentManager, openConsentManager } = createConsentManager({
  preset: 'oss',
})

const ALERT_BANNER_ACTIVE = true
const alertBannerData = {
  tag: 'Thank you',
  url: 'https://hashiconf.com/europe',
  text: 'HashiConf Europe is a wrap. Watch this year’s sessions on-demand.',
  linkText: 'Watch Now',
  // Set the `expirationDate prop with a datetime string (e.g. `2020-01-31T12:00:00-07:00`)
  // if you'd like the component to stop showing at or after a certain date
  expirationDate: `2021-06-20T12:00:00-07:00`,
}

function WaypointIoLayout({
  children,
}: {
  /** Page contents to render in the layout */
  children: React.ReactNode
}): React.ReactElement {
  return (
    <>
      <HashiHead
        title={headMetadata.title}
        siteName={headMetadata.title}
        description={headMetadata.description}
        image={headMetadata.image}
        icon={headMetadata.icon}
      >
        <meta
          name="og:title"
          property="og:title"
          content={headMetadata.title}
        />
        <meta
          name="og:description"
          property="og:title"
          content={headMetadata.description}
        />
      </HashiHead>

      <Min100Layout footer={<Footer openConsentManager={() => null} />}>
        {ALERT_BANNER_ACTIVE && (
          <AlertBanner {...alertBannerData} product="waypoint" hideOnMobile />
        )}
        <HashiStackMenu />
        <ProductSubnav />
        {children}
      </Min100Layout>
      <ConsentManager />
    </>
  )
}

function getWaypointLayout(page) {
  return <WaypointIoLayout>{page}</WaypointIoLayout>
}

export default WaypointIoLayout
export { getWaypointLayout }
