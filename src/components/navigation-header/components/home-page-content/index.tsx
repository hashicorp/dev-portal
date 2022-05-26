import InlineSvg from '@hashicorp/react-inline-svg'
import { ProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'
import { NavigationHeaderDropdownMenu } from '..'
import sharedNavStyles from '../../navigation-header.module.css'
import s from './home-page-content.module.css'

const HomePageHeaderContent = () => {
  const betaProductSlugs = __config.dev_dot.beta_product_slugs
  const menuItems = betaProductSlugs.map((slug: ProductSlug) => ({
    icon: slug,
    label: productSlugsToNames[slug],
    path: `/${slug}`,
  }))

  return (
    <div className={sharedNavStyles.leftSide}>
      <div className={sharedNavStyles.contentBeforeNav}>
        <InlineSvg
          className={s.siteLogo}
          src={require('../../img/logo-white.svg?include')}
        />
      </div>
      <div className="g-hide-on-mobile g-hide-on-tablet">
        <nav className={sharedNavStyles.nav}>
          <ul className={sharedNavStyles.navList}>
            <li>
              <NavigationHeaderDropdownMenu
                itemGroups={[menuItems]}
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
