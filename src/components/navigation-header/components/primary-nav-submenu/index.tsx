import { useCurrentProduct } from 'contexts'
import { NavigationHeaderDropdownMenu } from '..'

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

export default PrimaryNavSubmenu
