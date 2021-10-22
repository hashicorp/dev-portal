import HashiHead from '@hashicorp/react-head'
import HashiStackMenu from '@hashicorp/react-hashi-stack-menu'
import AlertBanner from '@hashicorp/react-alert-banner'
import Min100Layout from '@hashicorp/react-min-100-layout'
import createConsentManager from '@hashicorp/react-consent-manager/loader'
// product-specific layout elements
// TODO: consider abstracting this layout to work for all proxied .ios
import Footer from './footer'
import ProductSubnav from './subnav'
import React from 'react'

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

const title = 'Waypoint by HashiCorp'
const description =
  'Waypoint is  an open source solution that provides a modern workflow for build, deploy, and release across platforms.'

function WaypointIoLayout({
  children,
}: {
  /** Page contents to render in the layout */
  children: React.ReactNode
}): React.ReactElement {
  return (
    <>
      <HashiHead
        title={title}
        siteName={title}
        description={description}
        image="/img/waypoint/og-image.png"
        icon={[{ href: '/img/waypoint/_favicon.ico' }]}
      >
        <meta name="og:title" property="og:title" content={title} />
        <meta name="og:description" property="og:title" content={description} />
      </HashiHead>

      <Min100Layout
        footer={
          <Footer
            // openConsentManager={openConsentManager} TODO: do we need this?
            heading="Using Waypoint"
            description="The best way to understand what Waypoint can enable for your projects is to give it a try."
            cards={[
              {
                link:
                  'https://learn.hashicorp.com/collections/waypoint/get-started-kubernetes',
                img: '/img/waypoint/get-started-kubernetes.png',
                eyebrow: 'Tutorial',
                title: 'Get Started - Kubernetes',
                description:
                  'Build, deploy, and release applications to a Kubernetes cluster.',
              },
              {
                link:
                  'https://learn.hashicorp.com/tutorials/waypoint/get-started-intro',
                img: '/img/waypoint/intro-to-waypoint.png',
                eyebrow: 'Tutorial',
                title: 'Introduction to Waypoint',
                description:
                  'Waypoint enables you to publish any application to any platform with a single file and a single command.',
              },
            ]}
            ctaLinks={[
              {
                text: 'Waypoint tutorials',
                url: 'https://learn.hashicorp.com/waypoint',
              },
              {
                text: 'Waypoint documentation',
                url: '/docs',
              },
            ]}
            navLinks={[
              {
                text: 'Documentation',
                url: '/docs',
              },
              {
                text: 'API Reference',
                url: '/',
              },
              {
                text: 'Tutorials',
                url: 'https://learn.hashicorp.com/waypoint',
              },
              {
                text: 'Integrations',
                url: '/',
              },
            ]}
          />
        }
      >
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
