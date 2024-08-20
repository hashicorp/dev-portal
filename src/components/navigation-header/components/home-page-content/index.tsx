/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import InlineSvg from '@hashicorp/react-inline-svg'
import Link from 'components/link'
import { NavBarListContainer, PrimaryNavLink } from '..'
import { navigationData, navPromo } from 'lib/products'
import ProductPanel from '@hashicorp/react-components/src/components/nav-panel/product-panel'
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
					<ProductPanel productCategories={navigationData} promo={navPromo} />
				</li>
				<li>
					<PrimaryNavLink
						ariaLabel="Tutorials"
						navItem={{ label: 'Tutorials', url: '/tutorials' }}
					/>
				</li>
			</NavBarListContainer>
		</>
	)
}

export default HomePageHeaderContent
