// HashiCorp Imports
import { IconHashicorp24 } from '@hashicorp/flight-icons/svg-react/hashicorp-24'

// Global imports
import { ProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'
import { useCurrentProduct } from 'contexts'
import { NavigationHeaderItemGroup } from 'components/navigation-header/types'

// Local imports
import {
	NavigationHeaderDropdownMenu,
	PrimaryNavLink,
	PrimaryNavSubmenu,
} from '..'
import { ProductIconTextLink } from './components'
import { getNavItems } from './utils/get-nav-items'
import s from './product-page-content.module.css'

const ProductPageHeaderContent = () => {
	const currentProduct = useCurrentProduct()

	// Build menu items
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
	const homeMenuItem = {
		// TODO as string was not accepted
		icon: 'home' as $TSFixMe,
		label: 'HashiCorp Developer',
		path: '/',
	}

	// Construct item groups for the dropdown, avoid adding empty groups
	const allMainMenuItems: NavigationHeaderItemGroup[] = [
		{ items: [homeMenuItem] },
	]
	if (productItems.length) {
		allMainMenuItems.push({ label: 'Products', items: productItems })
	}

	return (
		<div className={s.root}>
			<div className={s.leftSideContainer}>
				<div className={s.hashicorpIconDropdown}>
					<NavigationHeaderDropdownMenu
						ariaLabel="Main menu"
						buttonClassName={s.companyLogoMenuButton}
						dropdownClassName={s.companyLogoMenuButtonDropdown}
						itemGroups={allMainMenuItems}
						leadingIcon={<IconHashicorp24 className={s.hashiLogo} />}
					/>
				</div>
				<div className={s.productIconTextLink}>
					<ProductIconTextLink
						name={currentProduct.name}
						slug={currentProduct.slug}
					/>
				</div>
			</div>
			<nav className={s.nav}>
				<ul className={s.navList}>
					{getNavItems(currentProduct).map((navItem) => {
						const ariaLabel = `${currentProduct.name} ${navItem.label}`
						const isSubmenu = 'items' in navItem

						return (
							<li key={navItem.label}>
								{isSubmenu ? (
									<PrimaryNavSubmenu ariaLabel={ariaLabel} navItem={navItem} />
								) : (
									<PrimaryNavLink ariaLabel={ariaLabel} navItem={navItem} />
								)}
							</li>
						)
					})}
				</ul>
			</nav>
		</div>
	)
}

export default ProductPageHeaderContent
