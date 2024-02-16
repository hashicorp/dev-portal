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
import { BaseLayoutProps, AlertBannerProps } from './types'
import s from './base-layout.module.css'
import { HTMLAttributes } from 'react'

const { ConsentManager, openConsentManager } = createConsentManager({
	preset: 'oss',
})

/**
 * Renders a layout with a navigation header, footer, and content area.
 *
 * Note: this layout will _always_ render a `MobileMenuButton`, even if
 * no `mobileMenuSlot` is provided. When `BaseLayout` is used directly,
 * we expect the consumer of the layout to render a `MobileMenuContainer`
 * somewhere else in their view, or provide `mobileMenuSlot` with a
 * `MobileMenuContainer` to render.
 *
 * If you need a layout with a built-in generic global mobile menu,
 * use `BaseLayoutGenericMobileMenu`.
 */

const BaseLayout = ({
	children,
	showFooterTopBorder = false,
	mobileMenuSlot,
	className,
}: BaseLayoutProps & HTMLAttributes<HTMLDivElement>) => {
	usePageviewAnalytics({
		siteId: process.env.NEXT_PUBLIC_FATHOM_SITE_ID,
		includedDomains: __config.dev_dot.analytics.included_domains,
	})
	useScrollPercentageAnalytics()

	return (
		<CommandBarProvider>
			{alertBannerData.enabled && (
				<AlertBanner {...(alertBannerData.data as AlertBannerProps)} />
			)}
			<CoreDevDotLayoutWithTheme>
				<div className={classNames(s.root, className)} data-layout="base-new">
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

export default BaseLayout
