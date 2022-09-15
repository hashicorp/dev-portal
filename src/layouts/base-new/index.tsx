// Third-party imports
import { useRouter } from 'next/router'
import classNames from 'classnames'

// HashiCorp imports
import usePageviewAnalytics from '@hashicorp/platform-analytics'
import createConsentManager from '@hashicorp/react-consent-manager/loader'

// Global imports
import { generateTopLevelSubNavItems } from 'lib/generate-top-level-sub-nav-items'
import useScrollPercentageAnalytics from 'hooks/use-scroll-percentage-analytics'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import { CommandBarProvider } from 'components/command-bar'
import Footer from 'components/footer'
import MobileMenuContainer, {
	MobileAuthenticationControls,
} from 'components/mobile-menu-container'
import NavigationHeader from 'components/navigation-header'
import { SidebarNavMenuItem } from 'components/sidebar/components'

// Local imports
import { BaseNewLayoutProps } from './types'
import s from './base-new-layout.module.css'

const { ConsentManager, openConsentManager } = createConsentManager({
	preset: 'oss',
})

/**
 * The mobile menu that shows on non-product pages, or pages that do not use the
 * SidebarSidecarLayout that usually handles the mobile menu.
 */
const NonProductPageMobileMenu = () => {
	return (
		<MobileMenuContainer className={s.mobileMenuContainer}>
			<MobileAuthenticationControls />
			<ul className={s.mobileMenuNavList}>
				<SidebarNavMenuItem item={{ heading: 'Main Menu' }} />
				{generateTopLevelSubNavItems().map((item: $TSFixMe, index: number) => (
					// eslint-disable-next-line react/no-array-index-key
					<SidebarNavMenuItem item={item} key={index} />
				))}
			</ul>
		</MobileMenuContainer>
	)
}

/**
 * TODO (future enhancement): rename and abstract `SidebarNavDataProvider` for
 * use here.
 */
const BaseNewLayout = ({
	children,
	showFooterTopBorder = false,
}: BaseNewLayoutProps) => {
	const router = useRouter()
	usePageviewAnalytics({
		siteId: process.env.NEXT_PUBLIC_FATHOM_SITE_ID,
		includedDomains: __config.dev_dot.analytics.included_domains,
	})
	useScrollPercentageAnalytics()

	/**
	 * We only want to show this menu for certain routes. Other routes use
	 * SidebarSidecarLayout, which handles the mobile menu for those routes.
	 */
	const shouldShowMobileMenu =
		router.route === '/' || router.route === '/_error'

	return (
		<CommandBarProvider>
			<CoreDevDotLayout>
				<div className={s.root} data-layout="base-new">
					<div className={s.header}>
						<NavigationHeader />
					</div>
					<div className={s.contentArea}>
						{shouldShowMobileMenu ? <NonProductPageMobileMenu /> : null}
						{children}
					</div>
					<div
						className={classNames(s.footer, {
							[s.showFooterTopBorder]: showFooterTopBorder,
						})}
					>
						<Footer openConsentManager={openConsentManager} />
					</div>
				</div>
			</CoreDevDotLayout>
			<ConsentManager />
		</CommandBarProvider>
	)
}

export default BaseNewLayout
