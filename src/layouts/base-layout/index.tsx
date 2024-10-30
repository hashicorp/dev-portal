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

// Global imports
import useScrollPercentageAnalytics from 'hooks/use-scroll-percentage-analytics'
import { CoreDevDotLayoutWithTheme } from 'layouts/core-dev-dot-layout'
import { CommandBarProvider } from 'components/command-bar'
import { createConsentManager } from 'lib/consent-manager'
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
	gtmId: process.env.NEXT_PUBLIC_GTM_CONTAINER_ID,
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

	if (process.env.VERCEL_ENV === 'development') {
		useEffect(() => {
			const clientId = crypto.randomUUID()
			const eventSource = new EventSource(`/api/refresh?id=${clientId}`)

			eventSource.onopen = () => {
				console.log(`Reload Client ${clientId} Connected`)
			}

			eventSource.onmessage = (event) => {
				try {
				  const data = event.data && JSON.parse(event?.data)
  
				  if (data.reload) {
					  console.log('Reload Client Reloading Page')
					  window.location.reload()
				  }
				} catch (err) {
					console.error('Error parsing message data:', err);
				}

			eventSource.onerror = () => {
				eventSource.close()
			}

			return () => {
				eventSource.close()
			}
		}, [])
	}

	return (
		<CommandBarProvider>
			<SkipLinkContext.Provider value={{ showSkipLink, setShowSkipLink }}>
				<SkipToMainContent />
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
			</SkipLinkContext.Provider>
		</CommandBarProvider>
	)
}

export default BaseLayout
