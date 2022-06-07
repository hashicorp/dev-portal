import InlineSvg from '@hashicorp/react-inline-svg'
import { ProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'
import getIsBetaProduct from 'lib/get-is-beta-product'
import { NavigationHeaderDropdownMenu } from '..'
import sharedNavStyles from '../../navigation-header.module.css'
import s from './home-page-content.module.css'

/**
 * @TODO update content to also show products "coming soon"
 * @see https://app.asana.com/0/1202110981600689/1202300536466714/f
 */
const HomePageHeaderContent = () => {
  const betaProductItems = []
  const comingSoonProductItems = []
  Object.keys(productSlugsToNames).forEach((productSlug: ProductSlug) => {
    // Ignore Sentinel for now
    if (productSlug === 'sentinel') {
      return
    }

    // Generate properties of each menu item
    const icon = productSlug
    const label = productSlugsToNames[productSlug]
    const path = `/${productSlug}`

    // Push the menu item to the correct array
    if (getIsBetaProduct(productSlug)) {
      betaProductItems.push({ icon, label, path })
    } else {
      comingSoonProductItems.push({
        ariaLabel: `Coming soon: ${label}`,
        icon,
        label,
      })
    }
  })

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
                itemGroups={[
                  {
                    items: betaProductItems,
                  },
                  {
                    label: 'Coming Soon',
                    items: comingSoonProductItems,
                  },
                ]}
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
