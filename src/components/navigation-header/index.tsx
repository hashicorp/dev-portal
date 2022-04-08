// Third-party imports
import { ReactNode } from 'react'
import Link from 'next/link'

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
 * The main navigation header for all DevDot pages. Renders two different
 * styles: one for the main home page, and one for all routes under
 * `/{productSlug}.`
 */
const NavigationHeader = () => {
  const betaProductSlugs = __config.dev_dot.products_with_content_preview_branch
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const currentProduct = useCurrentProduct()

  const Header = ({ children }: { children: ReactNode }) => (
    <header className={s.root}>{children}</header>
  )

  if (currentPath === '/') {
    return (
      <Header>
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
                  const menuItems = betaProductSlugs.map(
                    (slug: ProductSlug) => ({
                      icon: slug,
                      label: productSlugsToNames[slug],
                      path: `/${slug}/${pathSuffix}`,
                    })
                  )
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
        <div className={s.rightSide}>
          <HeaderSearchInput theme="dark" />
        </div>
      </Header>
    )
  } else {
    const isBetaProduct =
      currentProduct.slug === 'waypoint' || currentProduct.slug === 'vault'
    return (
      <Header>
        <div className={s.leftSide}>
          <button style={{ marginRight: 24 }}>TODO: H menu</button>
          <div style={{ maxWidth: 142 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              src={`https://via.placeholder.com/142x40?text=${productSlugsToNames[
                currentProduct.slug
              ].toUpperCase()}-LOGO`}
            />
          </div>
          {isBetaProduct && (
            <nav style={{ marginLeft: 114 }}>
              <ul
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                }}
              >
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
                            <a
                              className="g-focus-ring-from-box-shadow-dark"
                              style={{
                                borderRadius: 5,
                                color: 'var(--token-color-palette-neutral-400)',
                                cursor: 'pointer',
                                padding: '8px 12px',
                              }}
                            >
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
        <div className={s.rightSide}>
          <HeaderSearchInput theme="dark" />
        </div>
      </Header>
    )
  }
}

export type { NavigationHeaderItem }
export default NavigationHeader
