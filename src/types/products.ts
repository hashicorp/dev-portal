import { ProductMeta, Products } from '@hashicorp/platform-product-meta'
import { Product as LearnProduct } from 'lib/learn-client/types'
import { NavigationHeaderItem as NavHeaderItem } from 'components/navigation-header'
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

/**
 * Object representing the metadata for a product's "root docs path", or a
 * section of documentation for a product.
 *
 * Examples of root docs paths:
 *  - /waypoint/commands
 *  - /waypoint/docs
 *  - /waypoint/plugins
 */
interface RootDocsPath {
  /**
   * The name of an icon to associate with a root docs path.
   */
  iconName: string

  /**
   * The proper noun name of a root docs path.
   */
  name: string

  /**
   * The router path associated with a root docs path, excluding the slug of the
   * associated product.
   */
  path: string

  /**
   * An optional, shortened version of the `name` property. For example,
   * "Documentation" may be shortened to "Docs" in some places using this
   * property.
   */
  shortName?: string
}

/**
 * A navigation item that is rendered within a disclosure in the main navigation
 * header.
 */
interface NavigationHeaderItem {
  /**
   * The name of an icon to render on the left-hand side of the text for the
   * navigation item.
   */
  icon: NavHeaderItem['icon']

  /**
   * The suffix of the full path of the navigation header item. This suffix is
   * automatically concatenated with the currently viewed product slug.
   */
  pathSuffix: string

  /**
   * The visible text to render for the navigation item.
   */
  label: NavHeaderItem['label']
}

interface ProductData extends Product {
  algoliaConfig: {
    indexName: string
  }
  basePaths: string[]
  navigationHeaderItems: {
    [key: string]: NavigationHeaderItem[]
  }
  rootDocsPaths?: RootDocsPath[]
  sidebar: {
    landingPageNavData: MenuItem[]
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
