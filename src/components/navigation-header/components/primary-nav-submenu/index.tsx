import classNames from 'classnames'
import { useCurrentProduct } from 'contexts'
import { NavigationHeaderDropdownMenu } from '..'
import s from './primary-nav-submenu.module.css'

interface NavSubmenuProps {
  ariaLabel: string
  navItem: {
    id?: string
    isSubmenu?: boolean
    label: string
    pathSuffix?: string
  }
}

const PrimaryNavSubmenu = ({ ariaLabel, navItem }: NavSubmenuProps) => {
  const { id, label } = navItem
  const currentProduct = useCurrentProduct()

  return (
    <NavigationHeaderDropdownMenu
      ariaLabel={ariaLabel}
      iconClassName={classNames(
        s.primarySubnavDropdownItemIcon,
        currentProduct?.slug
      )}
      itemGroups={[
        {
          items: currentProduct.navigationHeaderItems[id].map(
            ({ icon, label, pathSuffix }) => ({
              icon,
              label,
              path: `/${currentProduct.slug}/${pathSuffix}`,
            })
          ),
        },
      ]}
      label={label}
    />
  )
}

export default PrimaryNavSubmenu
