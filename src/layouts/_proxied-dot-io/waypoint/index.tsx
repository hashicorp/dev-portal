import React from 'react'
import HashiHead from '@hashicorp/react-head'
import HashiStackMenu from '@hashicorp/react-hashi-stack-menu'
import AlertBanner from '@hashicorp/react-alert-banner'
import Min100Layout from '@hashicorp/react-min-100-layout'
import useProductMeta, { Products } from '@hashicorp/platform-product-meta'
import createConsentManager from '@hashicorp/react-consent-manager/loader'
// product-specific layout elements
// TODO: consider abstracting this layout to work for all proxied .ios
import Footer from 'components/_proxied-dot-io/waypoint/footer'
import ProductSubnav from 'components/_proxied-dot-io/waypoint/subnav'
import productData from 'data/waypoint.json'

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

      <Min100Layout
        footer={
          <Footer
            openConsentManager={openConsentManager}
            heading="Using Waypoint"
            description="The best way to understand what Waypoint can enable for your projects is to give it a try."
            cards={[
              {
                link:
                  'https://learn.hashicorp.com/collections/waypoint/get-started-kubernetes',
                img: '/img/get-started-kubernetes.png',
                eyebrow: 'Tutorial',
                title: 'Get Started - Kubernetes',
                description:
                  'Build, deploy, and release applications to a Kubernetes cluster.',
              },
              {
                link:
                  'https://learn.hashicorp.com/tutorials/waypoint/get-started-intro',
                img: '/img/intro-to-waypoint.png',
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
                text: 'CLI Reference',
                url: '/commands',
              },
              {
                text: 'Tutorials',
                url: 'https://learn.hashicorp.com/waypoint',
              },
              {
                text: 'Integrations',
                url: '/plugins',
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
        <div className={themeClass}>{children}</div>
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
