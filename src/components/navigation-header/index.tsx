// Third-party imports
import Link from 'next/link'

// HashiCorp imports
import HashiCorpLogo from '@hashicorp/mktg-logos/corporate/hashicorp/logomark/white.svg?include'
import VaultLogo from '@hashicorp/mktg-logos/product/vault/primary/colorwhite.svg?include'
import WaypointLogo from '@hashicorp/mktg-logos/product/waypoint/primary/colorwhite.svg?include'
import InlineSvg from '@hashicorp/react-inline-svg'

// Global imports
import { productSlugsToNames } from '../../../config/products'
import { ProductSlug } from 'types/products'
import useCurrentPath from 'hooks/use-current-path'
import { useCurrentProduct } from 'contexts'
import HeaderSearchInput from 'components/header-search-input'
import Text from 'components/text'

// Local imports
import { NavigationHeaderItem } from './types'
import { NavigationHeaderDropdownMenu } from './components'
import s from './navigation-header.module.css'

/**
 * Defines the navigation items for the main home page of the app. If this
 * becomes authorable, it can be lifted into another area of the codebase.
 */
const HOME_PAGE_NAV_ITEMS = [
  { label: 'Documentation', pathSuffix: 'docs' },
  { label: 'Tutorials', pathSuffix: 'tutorials' },
  { label: 'Install', pathSuffix: 'downloads' },
]

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

const HomePageHeaderContent = () => {
  const betaProductSlugs = __config.dev_dot.products_with_content_preview_branch

  return (
    <div className={s.leftSide}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        className={s.logo}
        src="https://via.placeholder.com/232x32?text=SITE-LOGO"
      />
      <nav className={s.nav}>
        <ul className={s.navList}>
          {HOME_PAGE_NAV_ITEMS.map(
            (navItem: { label: string; pathSuffix: string }) => {
              const { label, pathSuffix } = navItem
              const menuItems = betaProductSlugs.map((slug: ProductSlug) => ({
                icon: slug,
                label: productSlugsToNames[slug],
                path: `/${slug}/${pathSuffix}`,
              }))
              return (
                <li key={pathSuffix}>
                  <NavigationHeaderDropdownMenu
                    itemGroups={[menuItems]}
                    label={label}
                  />
                </li>
              )
            }
          )}
        </ul>
      </nav>
    </div>
  )
}

const ProductPageHeaderContent = () => {
  const betaProductSlugs = __config.dev_dot.products_with_content_preview_branch
  const currentProduct = useCurrentProduct()
  const isBetaProduct =
    currentProduct.slug === 'waypoint' || currentProduct.slug === 'vault'
  const companyLogo = (
    <InlineSvg className={s.companyLogo} src={HashiCorpLogo} />
  )
  const homeMenuItem = { icon: 'home', label: 'Developer Home', path: '/' }
  const betaProductMenuItems = betaProductSlugs.map((slug: ProductSlug) => ({
    icon: slug,
    label: productSlugsToNames[slug],
    path: `/${slug}`,
  }))
  const allMainMenuItems = [[homeMenuItem], betaProductMenuItems]
  const productLogo = PRODUCT_SLUGS_TO_LOGOS[currentProduct.slug]

  return (
    <div className={s.leftSide}>
      <NavigationHeaderDropdownMenu
        buttonClassName={s.companyLogoMenuButton}
        id="main-menu"
        itemGroups={allMainMenuItems}
        leadingIcon={companyLogo}
      />
      <InlineSvg className={s.productLogo} src={productLogo} />
      {isBetaProduct && (
        <nav className={s.nav}>
          <ul className={s.navList}>
            {PRODUCT_PAGE_NAV_ITEMS.map(
              (navItem: {
                id?: string
                isSubmenu?: boolean
                label: string
                pathSuffix?: string
              }) => {
                const { id, isSubmenu, label, pathSuffix } = navItem
                return (
                  <li key={label}>
                    {isSubmenu ? (
                      <NavigationHeaderDropdownMenu
                        itemGroups={[
                          currentProduct.navigationHeaderItems[id].map(
                            ({ icon, label, pathSuffix }) => ({
                              icon,
                              label,
                              path: `/${currentProduct.slug}/${pathSuffix}`,
                            })
                          ),
                        ]}
                        label={label}
                      />
                    ) : (
                      <Link href={`/${currentProduct.slug}/${pathSuffix}`}>
                        <a className={s.mainNavLink}>
                          <Text asElement="span" size={200} weight="medium">
                            {label}
                          </Text>
                        </a>
                      </Link>
                    )}
                  </li>
                )
              }
            )}
          </ul>
        </nav>
      )}
    </div>
  )
}

/**
 * The header content displayed to the far right of the window. This content is
 * the same for every page in the app.
 *
 * @TODO when we work on adding single-product search for beta, determine if we
 * will be showing `HeaderSearchInput` on the main home page.
 */
const RightSideHeaderContent = () => {
  return (
    <div className={s.rightSide}>
      <HeaderSearchInput theme="dark" />
    </div>
  )
}

/**
 * The main navigation header for all DevDot pages. Renders two different
 * styles: one for the main home page, and one for all routes under
 * `/{productSlug}.`
 */
const NavigationHeader = () => {
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const LeftSideHeaderContent =
    currentPath === '/' ? HomePageHeaderContent : ProductPageHeaderContent

  return (
    <header className={s.root}>
      <LeftSideHeaderContent />
      <RightSideHeaderContent />
    </header>
  )
}

export type { NavigationHeaderItem }
export default NavigationHeader
