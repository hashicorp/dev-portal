import usePageviewAnalytics from '@hashicorp/platform-analytics'
import createConsentManager from '@hashicorp/react-consent-manager/loader'
import Footer from 'components/footer'
import { FooterProps } from 'components/footer/types'
import NavigationHeader from 'components/navigation-header'
import useScrollPercentageAnalytics from 'hooks/use-scroll-percentage-analytics'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import s from './base-new-layout.module.css'

interface BaseNewLayoutProps {
  /** Defaults to true. If true, the global footer will be shown at the bottom of the page. */
  showFooter?: boolean
}

const { ConsentManager, openConsentManager } = createConsentManager({
  preset: 'oss',
})

export function FooterWithCookieManager(props: FooterProps) {
  return <Footer openConsentManager={openConsentManager} {...props} />
}

const BaseNewLayout: React.FC<BaseNewLayoutProps> = ({
  children,
  showFooter = true,
}) => {
  usePageviewAnalytics({
    siteId: process.env.NEXT_PUBLIC_FATHOM_SITE_ID,
    includedDomains: __config.dev_dot.analytics.included_domains,
  })
  useScrollPercentageAnalytics()

  return (
    <>
      <CoreDevDotLayout>
        <div className={s.root} data-layout="base-new">
          <div className={s.header}>
            <NavigationHeader />
          </div>
          <div className={s.contentArea}>{children}</div>
          {showFooter && (
            <div className={s.footer}>
              <FooterWithCookieManager />
            </div>
          )}
        </div>
      </CoreDevDotLayout>
      <ConsentManager />
    </>
  )
}

export default BaseNewLayout
