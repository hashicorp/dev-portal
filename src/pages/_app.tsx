import { ErrorBoundary } from '@hashicorp/platform-runtime-error-monitoring'
import '@hashicorp/platform-util/nprogress/style.css'
import NProgress from '@hashicorp/platform-util/nprogress'
import useAnchorLinkAnalytics from '@hashicorp/platform-util/anchor-link-analytics'
import Router from 'next/router'
import HashiHead from '@hashicorp/react-head'
import AlertBanner from '@hashicorp/react-alert-banner'
import HashiStackMenu from '@hashicorp/react-hashi-stack-menu'
import ProductSubnav from 'components/navigation/waypoint/subnav'
import Footer from 'components/footer/waypoint'
import createConsentManager from '@hashicorp/react-consent-manager/loader'

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

import './style.css'
import '@hashicorp/platform-util/nprogress/style.css'

const title = 'Waypoint by HashiCorp'
const description =
  'Waypoint is   an open source solution that provides a modern workflow for build, deploy, and release across platforms.'

NProgress({ Router })
const { ConsentManager, openConsentManager } = createConsentManager({
  preset: 'oss',
})

export default function App({ Component, pageProps }) {
  useAnchorLinkAnalytics()

  const getLayout =
    Component.getLayout ||
    ((page) => (
      <>
        <HashiHead
          title={title}
          siteName={title}
          description={description}
          image="https://www.waypointproject.io/img/og-image.png"
          icon={[{ href: '/_favicon.ico' }]}
        >
          <meta name="og:title" property="og:title" content={title} />
          <meta
            name="og:description"
            property="og:title"
            content={description}
          />
        </HashiHead>
        {ALERT_BANNER_ACTIVE && (
          <AlertBanner {...alertBannerData} product="waypoint" hideOnMobile />
        )}
        <HashiStackMenu />
        <ProductSubnav />
        <div className="content">{page}</div>
        <Footer openConsentManager={openConsentManager} />
        <ConsentManager />
      </>
    ))

  return (
    <ErrorBoundary FallbackComponent={Error}>
      {getLayout(<Component {...pageProps} />)}
    </ErrorBoundary>
  )
}
