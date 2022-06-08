// HashiCorp imports
import usePageviewAnalytics from '@hashicorp/platform-analytics'
import createConsentManager from '@hashicorp/react-consent-manager/loader'

// Global imports
import { generateTopLevelSubNavItems } from 'lib/generate-top-level-sub-nav-items'
import useCurrentPath from 'hooks/use-current-path'
import useScrollPercentageAnalytics from 'hooks/use-scroll-percentage-analytics'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import Footer from 'components/footer'
import MobileMenuContainer from 'components/mobile-menu-container'
import NavigationHeader from 'components/navigation-header'
import { SidebarNavMenuItem } from 'components/sidebar/components'

// Local imports
import { BaseNewLayoutProps } from './types'
import s from './base-new-layout.module.css'

const { ConsentManager, openConsentManager } = createConsentManager({
  preset: 'oss',
})

const BaseNewLayout = ({ children, showFooter = true }: BaseNewLayoutProps) => {
  // hooks
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  usePageviewAnalytics({
    siteId: process.env.NEXT_PUBLIC_FATHOM_SITE_ID,
    includedDomains: __config.dev_dot.analytics.included_domains,
  })
  useScrollPercentageAnalytics()

  // variables
  const isHomePage = currentPath === '/'

  return (
    <>
      <CoreDevDotLayout>
        <div className={s.root} data-layout="base-new">
          <div className={s.header}>
            <NavigationHeader />
          </div>
          <div className={s.contentArea}>
            {isHomePage && (
              <MobileMenuContainer className={s.mobileMenuContainer}>
                {/* TODO move this into css class */}
                {/* TODO use multiple lists? */}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <SidebarNavMenuItem item={{ heading: 'Main Menu' }} />
                  {generateTopLevelSubNavItems().map((item, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <SidebarNavMenuItem item={item} key={index} />
                  ))}
                </ul>
              </MobileMenuContainer>
            )}
            {children}
          </div>
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
