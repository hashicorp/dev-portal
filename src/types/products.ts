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
	 * Whether or not the remote MDX content for a path should be included in the
	 * rendered page content.
	 */
	includeMDXSource?: boolean

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
	 * Optional product slug for our content API. For some products, this differs
	 * from the product slug used on the client. For example, "hcp" is
	 * "cloud.hashicorp.com" in the content API.
	 */
	productSlugForLoader?: string

	/**
	 * An optional, shortened version of the `name` property. For example,
	 * "Documentation" may be shortened to "Docs" in some places using this
	 * property.
	 */
	shortName?: string

	/**
	 * An optional property to specify the nav-data file name prefix for our
	 * docs content loader.
	 *
	 * For example, the Terraform  base path `plugin/log`
	 * contains a slash, so we must provide the `navDataPrefix` as `plugin-log`
	 * to successfully load nav data from `plugin-log-nav-data.json`.
	 *
	 * If omitted, defaults to the basePath (`docs` → `docs-nav-data.json`).
	 */
	navDataPrefix?: string

	/**
	 * An optional property to signal that this root docs path is meant
	 * to render a "custom" landing page.
	 *
	 * These "custom" landing pages are, for now, intended to be rendered using
	 * a separate page file. Specifically:
	 * - Terraform standard docs views are meant to be rendered with the
	 *   `pages/terraform/[...allDocs].tsx` page file
	 * - Terraform "custom" docs landing pages are meant to be rendered with the
	 *   `pages/[productSlug]/docs/index.tsx` page file
	 *
	 * TODO: this approach currently does not seem to work reliably,
	 * likely due to routing quirks and conflicts between those two page files.
	 *
	 * Asana task: https://app.asana.com/0/1202097197789424/1202685617704813/f
	 */
	hasCustomLandingPage?: boolean
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
