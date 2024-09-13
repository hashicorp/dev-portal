/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import InlineSvg from '@hashicorp/react-inline-svg'
import Link from 'components/link'
import { NavBarListContainer, NavigationHeaderDropdownMenu } from '..'
import { navigationData, navPromo, sidePanelContent } from 'lib/products'
import s from './home-page-content.module.css'

const HomePageHeaderContent = () => {
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
			</NavBarListContainer>
		</>
	)
}

export default HomePageHeaderContent
