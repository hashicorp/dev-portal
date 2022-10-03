import Link from 'next/link'
import InlineSvg from '@hashicorp/react-inline-svg'
import { ProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'
import { NavigationHeaderDropdownMenu } from '..'
import sharedNavStyles from '../../navigation-header.module.css'
import s from './home-page-content.module.css'
import { NavigationHeaderItemGroup } from 'components/navigation-header/types'

const HomePageHeaderContent = () => {
	const productItems = []
	Object.keys(productSlugsToNames).forEach((productSlug: ProductSlug) => {
		// Exclude Sentinel for now
		if (productSlug === 'sentinel') {
			return
		}

		// Generate properties of each menu item
		const icon = productSlug
		const label = productSlugsToNames[productSlug]
		const path = `/${productSlug}`

		// Push the menu item to the correct array
		productItems.push({
			icon,
			label,
			path,
		})
	})

	// Construct item groups for the dropdown, avoid adding empty groups
	const itemGroups: NavigationHeaderItemGroup[] = []
	if (productItems.length) {
		itemGroups.push({ items: productItems })
	}

	return (
		<div className={sharedNavStyles.leftSide}>
			<div className={sharedNavStyles.contentBeforeNav}>
				<Link href="/">
					<a aria-label="HashiCorp Developer Home">
						<InlineSvg
							className={s.siteLogo}
							src={require('../../img/logo-white.svg?include')}
						/>
					</a>
				</Link>
			</div>
			<div className={sharedNavStyles.leftSideDesktopOnlyContent}>
				<nav className={sharedNavStyles.nav}>
					<ul className={sharedNavStyles.navList}>
						<li>
							<NavigationHeaderDropdownMenu
								itemGroups={itemGroups}
								label="Products"
							/>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	)
}

export default HomePageHeaderContent
