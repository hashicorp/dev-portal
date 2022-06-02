import { ProductMeta, Products } from '@hashicorp/platform-product-meta'
import { Product as LearnProduct } from 'lib/learn-client/types'
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

type LearnProductSlug = Exclude<ProductSlug, 'hcp' | 'sentinel'>

/**
 * This is needed so that `LearnProductData` can extend both `ProductData` and
 * `LearnProduct`. Otherwise, we get the following error:
 *
 * "Types of property 'name' are incompatible"
 */
type LearnProductName = Exclude<
  ProductName,
  'HashiCorp Cloud Platform' | 'Sentinel'
>

/**
 * Learn does not support all of the products in `ProductSlug`, so this is the
 * interface almost the same as `ProductData`, just with a limited set of
 * options for `slug`.
 */
interface LearnProductData extends ProductData {
  name: LearnProductName
  slug: LearnProduct['slug']
}

interface RootDocsPath {
  iconName: string
  name: string
  path: string
  shortName?: string
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
  rootDocsPaths?: RootDocsPath[]
  sidebar: {
    landingPageNavData: MenuItem[]
  }
  algoliaConfig: {
    indexName: string
  }
}

interface ProductWithCurrentRootDocsPath extends ProductData {
  currentRootDocsPath: RootDocsPath
}

type ProductGroup = Product[]

export type {
  LearnProductData,
  LearnProductName,
  LearnProductSlug,
  Product,
  ProductData,
  ProductGroup,
  ProductName,
  ProductSlug,
  ProductWithCurrentRootDocsPath,
  RootDocsPath,
}
