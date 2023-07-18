/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import classNames from 'classnames'
import AlertBanner from '@hashicorp/react-alert-banner'

// HashiCorp imports
import usePageviewAnalytics from '@hashicorp/platform-analytics'
import createConsentManager from '@hashicorp/react-consent-manager/loader'

// Global imports
import useScrollPercentageAnalytics from 'hooks/use-scroll-percentage-analytics'
import { CoreDevDotLayoutWithTheme } from 'layouts/core-dev-dot-layout'
import { CommandBarProvider } from 'components/command-bar'
import Footer from 'components/footer'
import NavigationHeader from 'components/navigation-header'
import alertBannerData from 'data/alert-banner.json'

// Local imports
import { BaseNewLayoutProps, AlertBannerProps } from './types'
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
	showFooterTopBorder = false,
	mobileMenuSlot,
}: BaseNewLayoutProps) => {
	usePageviewAnalytics({
		siteId: process.env.NEXT_PUBLIC_FATHOM_SITE_ID,
		includedDomains: __config.dev_dot.analytics.included_domains,
	})
	useScrollPercentageAnalytics()

	return (
		<CommandBarProvider>
			{alertBannerData.enabled && (
				<AlertBanner
					{...(alertBannerData.data as AlertBannerProps)}
					hideOnMobile
				/>
			)}
			<CoreDevDotLayoutWithTheme>
				<div className={s.root} data-layout="base-new">
					<div className={s.header}>
						<NavigationHeader />
					</div>
					<div className={s.contentArea}>
						{mobileMenuSlot}
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
			</CoreDevDotLayoutWithTheme>
			<ConsentManager />
		</CommandBarProvider>
	)
}

export default BaseNewLayout
