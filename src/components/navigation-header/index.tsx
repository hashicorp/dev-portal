import { ReactNode } from 'react'
import Link from 'next/Link'
import { productSlugsToNames } from '../../../config/products'
import { ProductSlug } from 'types/products'
import useCurrentPath from 'hooks/use-current-path'
import { useCurrentProduct } from 'contexts'
import HeaderSearchInput from 'components/header-search-input'
import Text from 'components/text'
import { NavigationHeaderItem } from './types'
import { NavigationHeaderDropdownMenu } from './components'
import s from './navigation-header.module.css'

const homePageNavItems = [
  { label: 'Documentation', pathSuffix: 'docs' },
  { label: 'Tutorials', pathSuffix: 'tutorials' },
  { label: 'Install', pathSuffix: 'downloads' },
]

const productPageNavItems = [
  { label: 'Home', pathSuffix: '' },
  { label: 'Documentation', id: 'documentation', isSubmenu: true },
  { label: 'Tutorials', pathSuffix: 'tutorials' },
  { label: 'Install', pathSuffix: 'downloads' },
]

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
              {homePageNavItems.map(
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
              {productPageNavItems.map(
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
