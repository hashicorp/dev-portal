// Third-party imports
import Link from 'next/link'

// HashiCorp Imports
import InlineSvg from '@hashicorp/react-inline-svg'
import BoundaryLogo from '@hashicorp/mktg-logos/product/boundary/primary-padding/colorwhite.svg?include'
import ConsulLogo from '@hashicorp/mktg-logos/product/consul/primary-padding/colorwhite.svg?include'
import HashiCorpLogo from '@hashicorp/mktg-logos/corporate/hashicorp/logomark/white.svg?include'
import NomadLogo from '@hashicorp/mktg-logos/product/nomad/primary-padding/colorwhite.svg?include'
import PackerLogo from '@hashicorp/mktg-logos/product/packer/primary-padding/colorwhite.svg?include'
import TerraformLogo from '@hashicorp/mktg-logos/product/terraform/primary-padding/colorwhite.svg?include'
import VagrantLogo from '@hashicorp/mktg-logos/product/vagrant/primary-padding/colorwhite.svg?include'
import VaultLogo from '@hashicorp/mktg-logos/product/vault/primary-padding/colorwhite.svg?include'
import WaypointLogo from '@hashicorp/mktg-logos/product/waypoint/primary-padding/colorwhite.svg?include'

// Global imports
import { ProductSlug, RootDocsPath } from 'types/products'
import getIsBetaProduct from 'lib/get-is-beta-product'
import { productSlugsToNames } from 'lib/products'
import useCurrentPath from 'hooks/use-current-path'
import { useCurrentProduct, useIsBetaProduct } from 'contexts'
import { NavigationHeaderItemGroup } from 'components/navigation-header/types'

// Local imports
import {
	NavigationHeaderDropdownMenu,
	PrimaryNavLink,
	PrimaryNavSubmenu,
} from '..'
import sharedNavStyles from '../../navigation-header.module.css'
import s from './product-page-content.module.css'

/**
 * A mapping of Product slugs to their imported SVG colorwhite logos. Used for
 * the headers under `/{productSlug}` pages.
 *
 * Note: Sentinel and HCP are excluded here,
 * as we do not yet have a confirmed design treatment.
 */
const PRODUCT_SLUGS_TO_LOGOS: Record<
	Exclude<ProductSlug, 'sentinel' | 'hcp'>,
	string
> = {
	boundary: BoundaryLogo,
	consul: ConsulLogo,
	nomad: NomadLogo,
	packer: PackerLogo,
	terraform: TerraformLogo,
	vagrant: VagrantLogo,
	vault: VaultLogo,
	waypoint: WaypointLogo,
}

const ProductPageHeaderContent = () => {
	const currentProduct = useCurrentProduct()
	const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
	const isBetaProduct = useIsBetaProduct(currentProduct.slug)
	const productLogo = PRODUCT_SLUGS_TO_LOGOS[currentProduct.slug]
	const isProductHomePage = currentPath === `/${currentProduct.slug}`
	const companyLogo = (
		<InlineSvg className={s.companyLogo} src={HashiCorpLogo} />
	)

	// Build menu items
	const betaProductItems = []
	const comingSoonProductItems = []
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
		if (getIsBetaProduct(productSlug)) {
			betaProductItems.push({
				icon,
				label,
				path,
			})
		} else {
			comingSoonProductItems.push({
				ariaLabel: `Coming soon: ${label}`,
				icon,
				label,
			})
		}
	})
	const homeMenuItem = {
		// TODO as string was not accepted
		icon: 'home' as $TSFixMe,
		label: 'HashiCorp Developer',
		path: '/',
		badge: {
			text: 'Beta',
			color: 'highlight' as const,
		},
	}

	// Construct item groups for the dropdown, avoid adding empty groups
	const allMainMenuItems: NavigationHeaderItemGroup[] = [
		{ items: [homeMenuItem] },
	]
	if (betaProductItems.length) {
		allMainMenuItems.push({ label: 'Products', items: betaProductItems })
	}
	if (comingSoonProductItems.length) {
		allMainMenuItems.push({
			label: 'Coming Soon',
			items: comingSoonProductItems,
		})
	}

	return (
		<div className={sharedNavStyles.leftSide}>
			<div className={sharedNavStyles.contentBeforeNav}>
				<div className="g-hide-on-mobile g-hide-on-tablet">
					<NavigationHeaderDropdownMenu
						ariaLabel="Main menu"
						buttonClassName={s.companyLogoMenuButton}
						dropdownClassName={s.companyLogoMenuButtonDropdown}
						itemGroups={allMainMenuItems}
						leadingIcon={companyLogo}
					/>
				</div>
				<Link href={`/${currentProduct.slug}`}>
					<a
						aria-current={isProductHomePage ? 'page' : undefined}
						aria-label={`${currentProduct.name} home`}
						className={s.productLogoLink}
					>
						<InlineSvg
							className={sharedNavStyles.productLogo}
							src={productLogo}
						/>
					</a>
				</Link>
			</div>
			{isBetaProduct && (
				<div className="g-hide-on-mobile g-hide-on-tablet">
					<nav className={sharedNavStyles.nav}>
						<ul className={sharedNavStyles.navList}>
							{[
								{ label: 'Home', pathSuffix: '' },
								{
									label: 'Documentation',
									iconColorTheme: currentProduct.slug,
									items: currentProduct.rootDocsPaths.map(
										(rootDocsPath: RootDocsPath) => {
											return {
												icon: rootDocsPath.iconName,
												label: rootDocsPath.name,
												path: `/${currentProduct}/${rootDocsPath.path}`,
											}
										}
									),
								},
								{ label: 'Tutorials', pathSuffix: 'tutorials' },
								{ label: 'Install', pathSuffix: 'downloads' },
							].map((navItem) => {
								const { items, label } = navItem
								const ariaLabel = `${currentProduct.name} ${label}`

								let ItemContent
								if (items) {
									ItemContent = PrimaryNavSubmenu
								} else {
									ItemContent = PrimaryNavLink
								}

								return (
									<li key={label}>
										<ItemContent ariaLabel={ariaLabel} navItem={navItem} />
									</li>
								)
							})}
						</ul>
					</nav>
				</div>
			)}
		</div>
	)
}

export default ProductPageHeaderContent
