import Link from 'next/link'
import InlineSvg from '@hashicorp/react-inline-svg'
import HashiCorpLogo from '@hashicorp/mktg-logos/corporate/hashicorp/logomark/white.svg?include'
import VaultLogo from '@hashicorp/mktg-logos/product/vault/primary-padding/colorwhite.svg?include'
import WaypointLogo from '@hashicorp/mktg-logos/product/waypoint/primary-padding/colorwhite.svg?include'
import { ProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'
import useCurrentPath from 'hooks/use-current-path'
import { useCurrentProduct, useIsBetaProduct } from 'contexts'
import {
  NavigationHeaderDropdownMenu,
  PrimaryNavLink,
  PrimaryNavSubmenu,
} from '..'
import sharedNavStyles from '../../navigation-header.module.css'
import s from './product-page-content.module.css'

/**
 * Defined the navigation items for all pages that live under `/{productSlug}`
 * routes. If this becomes authorable, it can be lifted into another area of the
 * codebase.
 */
const PRODUCT_PAGE_NAV_ITEMS = [
  { label: 'Home', pathSuffix: '' },
  { label: 'Documentation', id: 'documentation', isSubmenu: true },
  { label: 'Tutorials', pathSuffix: 'tutorials' },
  { label: 'Install', pathSuffix: 'downloads' },
]

/**
 * A mapping of Product slugs to their imported SVG colorwhite logos. Used for
 * the headers under `/{productSlug}` pages.
 */
const PRODUCT_SLUGS_TO_LOGOS = {
  vault: VaultLogo,
  waypoint: WaypointLogo,
}

const ProductPageHeaderContent = () => {
  const currentProduct = useCurrentProduct()
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const isBetaProduct = useIsBetaProduct(currentProduct.slug)
  const betaProductSlugs = __config.dev_dot.beta_product_slugs
  const companyLogo = (
    <InlineSvg className={s.companyLogo} src={HashiCorpLogo} />
  )
  const homeMenuItem = { icon: 'home', label: 'Developer Home', path: '/' }
  const betaProductMenuItems = betaProductSlugs.map((slug: ProductSlug) => ({
    icon: slug,
    label: productSlugsToNames[slug],
    path: `/${slug}`,
  }))
  const allMainMenuItems = [
    { items: [homeMenuItem] },
    { items: betaProductMenuItems },
  ]
  const productLogo = PRODUCT_SLUGS_TO_LOGOS[currentProduct.slug]
  const isProductHomePage = currentPath === `/${currentProduct.slug}`

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
              {PRODUCT_PAGE_NAV_ITEMS.map((navItem) => {
                const { isSubmenu, label } = navItem
                const ariaLabel = `${currentProduct.name} ${label}`

                let ItemContent
                if (isSubmenu) {
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
