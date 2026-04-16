/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import InlineSvg from '@hashicorp/react-inline-svg'
import Link from 'components/link'
import { NavBarListContainer, NavigationHeaderDropdownMenu } from '..'
import { navigationData, navPromo, sidePanelContent } from 'lib/products'
import s from './home-page-content.module.css'

const HomePageHeaderContent = () => {
	const iaPosthogVariant = true // TODO: Replace with actual PostHog experiment variant check when available
	return (
		<>
			<Link
				href="/"
				aria-label="HashiCorp Developer Home"
				className={s.siteLogoLink}
			>
				<InlineSvg
					className={s.siteLogo}
					src={require('../../img/logo-white.svg?include')}
				/>
			</Link>
			<NavBarListContainer>
				<li>
					<NavigationHeaderDropdownMenu
						dropdownClassName={s.homepageDropdownPane}
						productPanelData={{
							navigationData,
							navPromo,
							sidePanelContent,
						}}
						label="Products"
					/>
				</li>
				{iaPosthogVariant && (
					<li>
						<NavigationHeaderDropdownMenu
							// dropdownClassName={s.homepageDropdownPane}
							standardPanelData={{
								navData: [
									{
										navItems: [
											{
												title: 'Certifications',
												url: '/certifications',
												description: 'Get HashiCorp certified',
												icon: 'award',
												iconGradient: 'Learn',
												// isDevPortal: true,
											},
											{
												title: 'Tutorials',
												url: '/tutorials',
												description: 'Learn HashiCorp products',
												icon: 'learn',
												iconGradient: 'Learn',
												// isDevPortal: true,
											},
											{
												title: 'Validated Patterns',
												url: '/validated-patterns',
												description:
													'Field-tested patterns for using HashiCorp products',
												icon: 'learn',
												iconGradient: 'Learn',
												// isDevPortal: true,
											},
											{
												title: 'Well-Architected Framework',
												url: '/well-architected-framework',
												description: 'Adopt HashiCorp best practices',
												icon: 'layers',
												iconGradient: 'Learn',
												// isDevPortal: true,
											},
										],
									},
								],
							}}
							label="Learn"
						/>
					</li>
				)}
			</NavBarListContainer>
		</>
	)
}

export default HomePageHeaderContent
