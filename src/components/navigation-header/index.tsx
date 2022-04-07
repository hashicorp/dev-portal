import { ReactNode } from 'react'
import { productSlugsToNames } from '../../../config/products'
import { ProductSlug } from 'types/products'
import useCurrentPath from 'hooks/use-current-path'
import { useCurrentProduct } from 'contexts'
import HeaderSearchInput from 'components/header-search-input'
import { NavigationHeaderItem } from './types'
import s from './navigation-header.module.css'
import { NavigationHeaderDropdownMenu } from './components'

const homePageNavItems = [
  { label: 'Documentation', path: 'docs' },
  { label: 'Tutorials', path: 'tutorials' },
  { label: 'Install', path: 'downloads' },
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
            src="https://via.placeholder.com/232x32?text=LOGO"
          />
          <nav>
            <ul className={s.navList}>
              {homePageNavItems.map(
                (navItem: { label: string; path: string }) => {
                  const { label, path } = navItem
                  const menuItems = betaProductSlugs.map(
                    (slug: ProductSlug) => ({
                      icon: slug,
                      label: productSlugsToNames[slug],
                      path: `/${slug}/${path}`,
                    })
                  )
                  return (
                    <li key={path}>
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
        <div
          style={{ color: 'white', padding: 24 }}
        >{`WIP: ${currentProduct.name} Header`}</div>
      </Header>
    )
  }
}

export type { NavigationHeaderItem }
export default NavigationHeader
