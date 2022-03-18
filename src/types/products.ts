import { ProductMeta, Products } from '@hashicorp/platform-product-meta'
import { NavigationHeaderItem } from 'components/navigation-header/types'
import { MenuItem } from 'components/sidebar'

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
  basePaths?: string[]
  name: ProductName
  navigationHeaderItems?: NavigationHeaderItem[]
  sidebar?: {
    landingPageNavData: MenuItem[]
    resourcesNavData: MenuItem[]
  }
  slug: ProductSlug
  url?: string
}

type ProductGroup = Product[]

export type { Product, ProductGroup, ProductName, ProductSlug }
