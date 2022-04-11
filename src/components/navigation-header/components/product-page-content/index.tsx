import Link from 'next/link'
import InlineSvg from '@hashicorp/react-inline-svg'
import HashiCorpLogo from '@hashicorp/mktg-logos/corporate/hashicorp/logomark/white.svg?include'
import VaultLogo from '@hashicorp/mktg-logos/product/vault/primary-padding/colorwhite.svg?include'
import WaypointLogo from '@hashicorp/mktg-logos/product/waypoint/primary-padding/colorwhite.svg?include'
import { ProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'
import useCurrentPath from 'hooks/use-current-path'
import { useCurrentProduct, useIsBetaProduct } from 'contexts'
import Text from 'components/text'
import { NavigationHeaderDropdownMenu } from '..'
import s from '../../navigation-header.module.css'

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
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const currentProduct = useCurrentProduct()
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
  const allMainMenuItems = [[homeMenuItem], betaProductMenuItems]
  const productLogo = PRODUCT_SLUGS_TO_LOGOS[currentProduct.slug]
  const isProductHomePage = currentPath === `/${currentProduct.slug}`

  return (
    <div className={s.leftSide}>
      <div className={s.contentBeforeNav}>
        <NavigationHeaderDropdownMenu
          ariaLabel="Main menu"
          buttonClassName={s.companyLogoMenuButton}
          itemGroups={allMainMenuItems}
          leadingIcon={companyLogo}
        />
        <Link href={`/${currentProduct.slug}`}>
          <a
            aria-current={isProductHomePage ? 'page' : undefined}
            aria-label={`${currentProduct.name} home`}
            className={s.productLogoLink}
          >
            <InlineSvg className={s.productLogo} src={productLogo} />
          </a>
        </Link>
      </div>
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
                const ariaLabel = `${currentProduct.name} ${label}`

                const Submenu = () => {
                  return (
                    <NavigationHeaderDropdownMenu
                      ariaLabel={ariaLabel}
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
                  )
                }

                const NavLink = () => {
                  const linkHref = `/${currentProduct.slug}/${pathSuffix}`
                  const isCurrentPage =
                    linkHref === currentPath || linkHref === `${currentPath}/`
                  return (
                    <Link href={linkHref}>
                      <a
                        aria-current={isCurrentPage ? 'page' : undefined}
                        aria-label={ariaLabel}
                        className={s.mainNavLink}
                      >
                        <Text asElement="span" size={200} weight="medium">
                          {label}
                        </Text>
                      </a>
                    </Link>
                  )
                }

                return (
                  <li key={label}>{isSubmenu ? <Submenu /> : <NavLink />}</li>
                )
              }
            )}
          </ul>
        </nav>
      )}
    </div>
  )
}

export default ProductPageHeaderContent
