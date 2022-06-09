import classNames from 'classnames'

// HashiCorp imports
import usePageviewAnalytics from '@hashicorp/platform-analytics'
import createConsentManager from '@hashicorp/react-consent-manager/loader'

// Global imports
import useScrollPercentageAnalytics from 'hooks/use-scroll-percentage-analytics'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import Footer from 'components/footer'
import NavigationHeader from 'components/navigation-header'

// Local imports
import { BaseNewLayoutProps } from './types'
import s from './base-new-layout.module.css'

const { ConsentManager, openConsentManager } = createConsentManager({
  preset: 'oss',
})

/**
 * TODO (future enhancement): rename and abstract `SidebarNavDataProvider` for
 * use here.
 */
const BaseNewLayout = ({
  children,
  showFooter = true,
  showFooterTopBorder = false,
}: BaseNewLayoutProps) => {
  // hooks
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
            <div
              className={classNames(s.footer, {
                [s.showFooterTopBorder]: showFooterTopBorder,
              })}
            >
              <Footer openConsentManager={openConsentManager} />
            </div>
          )}
        </div>
      </CoreDevDotLayout>
      <ConsentManager />
    </>
  )
}

export default BaseNewLayout
