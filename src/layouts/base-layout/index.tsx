/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import classNames from 'classnames'
import AlertBanner from '@hashicorp/react-alert-banner'
import { HTMLAttributes, useEffect, useState } from 'react'

// HashiCorp imports
import usePageviewAnalytics from '@hashicorp/platform-analytics'
import createConsentManager from '@hashicorp/react-consent-manager/loader'

// Global imports
import useScrollPercentageAnalytics from 'hooks/use-scroll-percentage-analytics'
import { CoreDevDotLayoutWithTheme } from 'layouts/core-dev-dot-layout'
import { CommandBarProvider } from 'components/command-bar'
import developerConsentManagerServices from 'lib/consent-manager-services/developer'
import Footer from 'components/footer'
import NavigationHeader from 'components/navigation-header'
import alertBannerData from 'data/alert-banner.json'
import { SkipLinkContext } from 'contexts'
import SkipToMainContent from 'components/skip-to-main-content'
import usePostHogPageAnalytics from 'hooks/use-posthog-analytics'

// Local imports
import { BaseLayoutProps, AlertBannerProps } from './types'
import s from './base-layout.module.css'

const { ConsentManager, openConsentManager } = createConsentManager({
	preset: 'oss',
	otherServices: [...developerConsentManagerServices],
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
	usePostHogPageAnalytics()
	useScrollPercentageAnalytics()
	const [showSkipLink, setShowSkipLink] = useState(false)

	// TODO: remove after HashiConf 2024
	// start of code to remove
	const [isDuringHashiConf, setIsDuringHashiConf] = useState(false)

	useEffect(() => {
		const now = new Date().getTime() // current date & time
		const firstHashiConfDayStart = new Date(
			'2024-10-15T04:30:00-08:00'
		).getTime() // 8:30 AM EDT on October 15, 2024
		const firstHashiConfDayEnd = new Date('2024-10-15T08:31:00-08:00').getTime() // 12:30 PM EDT on October 15, 2024

		const secondHashiConfDayStart = new Date(
			'2024-10-16T04:30:00-08:00'
		).getTime() // 8:30 AM EDT on October 16, 2024
		const secondHashiConfDayEnd = new Date(
			'2024-10-16T08:31:00-08:00'
		).getTime() // 12:30 PM EDT on October 16, 2024

		const isFirstHashiConfDay =
			now >= firstHashiConfDayStart && now <= firstHashiConfDayEnd
		const isSecondHashiConfDay =
			now >= secondHashiConfDayStart && now <= secondHashiConfDayEnd

		setIsDuringHashiConf(isFirstHashiConfDay || isSecondHashiConfDay)

		return () => {
			setIsDuringHashiConf(false)
		}
	}, [])
	// end of code to remove

	return (
		<CommandBarProvider>
			<SkipLinkContext.Provider value={{ showSkipLink, setShowSkipLink }}>
				<SkipToMainContent />
				{isDuringHashiConf && ( // TODO: revert this line back to `alertBannerData.enabled` after HashiConf 2024
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
			</SkipLinkContext.Provider>
		</CommandBarProvider>
	)
}

export default BaseLayout
