/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import InlineSvg from '@hashicorp/react-inline-svg'
import Link from 'components/link'
import { NavBarListContainer, NavigationHeaderDropdownMenu } from '..'
import { getAllProductsNavItems } from 'components/navigation-header/helpers'
import s from './home-page-content.module.css'

const HomePageHeaderContent = () => {
	return (
		<>
			<Link
				href="/"
				aria-label="HashiCorp Developer Home"
				data-heap-track="navigation-header-home-logo-link"
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
						itemGroups={[{ items: getAllProductsNavItems() }]}
						label="Products"
					/>
				</li>
			</NavBarListContainer>
		</>
	)
}

export default HomePageHeaderContent
