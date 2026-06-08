/**
 * Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

import InlineSvg from '@hashicorp/react-inline-svg'
import Link from 'components/link'
import { NavBarListContainer, NavigationHeaderDropdownMenu } from '..'
import {
	navigationData,
	navPromo,
	iaExperimentNavPromo,
	sidePanelContent,
} from 'lib/products'
import s from './home-page-content.module.css'
import { useExperiments } from 'contexts/experiments'
import { trackNavClickEvent } from 'lib/posthog-events'

const HomePageHeaderContent = () => {
	const { flags } = useExperiments()
	const iaPosthogKey = flags['ia-subnav-bar']
	const iaPosthogVariant = iaPosthogKey === 'test'
	return (
		<>
			<Link
				href="/"
				aria-label="HashiCorp Developer Home"
				className={s.siteLogoLink}
				onClickCapture={() => {
					trackNavClickEvent('HashiCorp Developer Home', '/')
				}}
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
							navPromo: iaPosthogVariant ? iaExperimentNavPromo : navPromo,
							sidePanelContent,
						}}
						label="Products"
					/>
				</li>
				{iaPosthogVariant && (
					<li>
						<NavigationHeaderDropdownMenu
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
												isDevPortal: true,
											},
											{
												title: 'Tutorials',
												url: '/tutorials',
												description: 'Learn HashiCorp products',
												icon: 'learn',
												iconGradient: 'Learn',
												isDevPortal: true,
											},
											{
												title: 'Validated Patterns',
												url: '/validated-patterns',
												description:
													'Field-tested patterns for using HashiCorp products',
												icon: 'learn',
												iconGradient: 'Learn',
												isDevPortal: true,
											},
											{
												title: 'Well-Architected Framework',
												url: '/well-architected-framework',
												description: 'Adopt HashiCorp best practices',
												icon: 'layers',
												iconGradient: 'Learn',
												isDevPortal: true,
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
