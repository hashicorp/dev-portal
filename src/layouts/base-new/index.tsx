import { ReactNode } from 'react'
import usePageviewAnalytics from '@hashicorp/platform-analytics'
import createConsentManager from '@hashicorp/react-consent-manager/loader'
import DevAlertBanner from 'components/dev-alert-banner'
import Footer from 'components/footer'
import NavigationHeader from 'components/navigation-header'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import s from './base-new-layout.module.css'

interface BaseNewLayoutProps {
  /**
   * Content to render within the layout.
   */
  children: ReactNode

  /**
   * Defaults to true. If true, the global footer will be shown at the bottom of
   * the page.
   */
  showFooter?: boolean

  /** @TODO */
  sidebarIsOpen: boolean

  /** @TODO */
  setSidebarIsOpen: (newValue: boolean) => void
}

const { ConsentManager, openConsentManager } = createConsentManager({
  preset: 'oss',
})

const BaseNewLayout = ({
  children,
  showFooter = true,
  sidebarIsOpen,
  setSidebarIsOpen,
}: BaseNewLayoutProps) => {
  usePageviewAnalytics({
    siteId: process.env.NEXT_PUBLIC_FATHOM_SITE_ID,
    includedDomains: __config.dev_dot.analytics.included_domains,
  })

  return (
    <>
      <CoreDevDotLayout>
        <div className={s.root} data-layout="base-new">
          <div className={s.header}>
            <DevAlertBanner />
            <NavigationHeader
              sidebarIsOpen={sidebarIsOpen}
              setSidebarIsOpen={setSidebarIsOpen}
            />
          </div>
          <div className={s.contentArea}>{children}</div>
          {showFooter && (
            <div className={s.footer}>
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
