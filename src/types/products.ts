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
	 * Optional basePath for our content API. For "sentinel", this differs
	 * from the basePath used on the client, as sentinel content is served
	 * on docs.hashicorp.com/sentinel.
	 */
	basePathForLoader?: string

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
	 * An optional property to specify which branch our
	 * content API should pull from. Defaults to `main`.
	 */
	mainBranch?: string

	/**
	 * An optional property to hide the title of this rootDocsPath
	 * in the sidebar. Used for Terraform routes where sidebar titles
	 * are present in nav-data.json.
	 */
	visuallyHideSidebarTitle?: boolean

	/**
	 * An optional property to add an "overview" item to the sidebar.
	 * By default, an overview item will be added. This property must be
	 * explicitly set to `false` to prevent an overview item from being added.
	 * The `href` for this item will lead to the root docs path,
	 * and will dynamically account for version context.
	 */
	addOverviewItem?: boolean

	/**
	 * An optional description for this category of documentation.
	 * Shown as the subtitle of the docs landing hero element.
	 * If omitted, falls back to the page's authored frontMatter.description,
	 * or falls back to an empty string.
	 */
	description?: string
}

export type DocsNavItem = {
	icon: string
	label: string
	fullPath: string
}

interface ProductData extends Product {
	algoliaConfig: {
		indexName: string
	}
	basePaths: string[]
	rootDocsPaths: RootDocsPath[]
	/**
	 * When configuring docsNavItems, authors have the option to specify
	 * the full data structure, or use a string that matches a rootDocsPath.path
	 * as a shorthand, in which case a DocsNavItem will be parsed from
	 * the matching rootDocsPath.
	 */
	docsNavItems?: (DocsNavItem | string)[]
	devDotCutoverMessage?: {
		cutoverDate: string
		showCutoverDate: boolean
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
