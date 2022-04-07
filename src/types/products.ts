import { ProductMeta, Products } from '@hashicorp/platform-product-meta'
import { MenuItem } from 'components/sidebar'
import { NavigationHeaderItem } from 'components/navigation-header'

type ProductName =
  | 'Boundary'
  | 'Consul'
  | 'HashiCorp Cloud Platform'
  | 'Nomad'
  | 'Packer'
  | 'Sentinel'
  | 'Terraform'
  | 'Vagrant'
  | 'Vault'
  | 'Waypoint'

type ProductSlug = Exclude<Products, 'hashicorp'> | 'hcp' | 'sentinel'

/**
 * TODO: put basePaths in a separate interface that extends the Product one?
 */
interface Product extends ProductMeta {
  name: ProductName
  slug: ProductSlug
}

interface ProductData extends Product {
  basePaths: string[]
  navigationHeaderItems: {
    [key: string]: {
      icon: NavigationHeaderItem['icon']
      pathSuffix: string
      label: NavigationHeaderItem['label']
    }[]
  }
  sidebar: {
    landingPageNavData: MenuItem[]
    resourcesNavData: MenuItem[]
  }
}

type ProductGroup = Product[]

export type { Product, ProductData, ProductGroup, ProductName, ProductSlug }
