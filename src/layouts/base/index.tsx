import Router from 'next/router'
import AlertBanner from '@hashicorp/react-alert-banner'
import createConsentManager from '@hashicorp/react-consent-manager/loader'
import Footer from 'components/footer'
import HashiHead from '@hashicorp/react-head'
import Min100Layout from '@hashicorp/react-min-100-layout'
import NProgress from '@hashicorp/platform-util/nprogress'

// TODO: we likely want to replace AlertBanner
// TODO: with a more layout-shift-friendly approach
const ALERT_BANNER_ACTIVE = false
const alertBannerData = {
  tag: 'Thank you',
  url: 'https://hashiconf.com/europe',
  text: 'HashiConf Europe is a wrap. Watch this year’s sessions on-demand.',
  linkText: 'Watch Now',
  expirationDate: `2021-06-20T12:00:00-07:00`,
}

const title = 'Dev Portal by HashiCorp'
const description =
  'Dev Portal is an open source solution that provides a modern workflow for build, deploy, and release across platforms.'

NProgress({ Router })
const { ConsentManager, openConsentManager } = createConsentManager({
  preset: 'oss',
})

const BaseLayout: React.FC = ({ children }) => (
  <>
    <HashiHead
      title={title}
      pageName={title}
      siteName={title}
      description={description}
      image="https://www.waypointproject.io/img/og-image.png"
      icon={[{ href: '/_favicon.ico' }]}
    />
    <Min100Layout footer={<Footer openConsentManager={openConsentManager} />}>
      {ALERT_BANNER_ACTIVE && (
        <AlertBanner {...alertBannerData} product="hashicorp" hideOnMobile />
      )}
      {children}
    </Min100Layout>
    <ConsentManager />
  </>
)

export default BaseLayout
