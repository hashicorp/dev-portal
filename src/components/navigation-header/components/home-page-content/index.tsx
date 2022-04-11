import InlineSvg from '@hashicorp/react-inline-svg'
import { ProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'
import { NavigationHeaderDropdownMenu } from '..'
import s from '../../navigation-header.module.css'

/**
 * Defines the navigation items for the main home page of the app. If this
 * becomes authorable, it can be lifted into another area of the codebase.
 */
const HOME_PAGE_NAV_ITEMS = [
  { label: 'Documentation', pathSuffix: 'docs' },
  { label: 'Tutorials', pathSuffix: 'tutorials' },
  { label: 'Install', pathSuffix: 'downloads' },
]

const HomePageHeaderContent = () => {
  const betaProductSlugs = __config.dev_dot.beta_product_slugs

  return (
    <div className={s.leftSide}>
      <div className={s.contentBeforeNav}>
        <InlineSvg
          className={s.siteLogo}
          src={require('../../img/logo-white.svg?include')}
        />
      </div>
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

export default HomePageHeaderContent
