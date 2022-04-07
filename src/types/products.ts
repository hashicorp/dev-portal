import { ProductMeta, Products } from '@hashicorp/platform-product-meta'
import { ProductOption } from 'lib/learn-client/types'
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

interface Product extends ProductMeta {
  name: ProductName
  slug: ProductSlug
}

/**
 * Learn does not support all of the products in `ProductSlug`, so this is the
 * interface almost the same as `ProductData`, just with a limited set of
 * options for `slug`.
 */
interface LearnProductData extends ProductData {
  slug: ProductOption
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

export type {
  LearnProductData,
  Product,
  ProductData,
  ProductGroup,
  ProductName,
  ProductSlug,
}
