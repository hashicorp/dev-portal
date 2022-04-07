import { ProductMeta, Products } from '@hashicorp/platform-product-meta'
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
  name: ProductName
  slug: ProductSlug
}

interface ProductData extends Product {
  basePaths: string[]
  navigationHeaderItems: {
    [key: string]: { icon: string; pathSuffix: string; label: string }
  }
  sidebar: {
    landingPageNavData: MenuItem[]
    resourcesNavData: MenuItem[]
  }
}

type ProductGroup = Product[]

export type { Product, ProductData, ProductGroup, ProductName, ProductSlug }
