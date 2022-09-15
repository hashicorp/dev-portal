import rivet from 'rivet-graphql'
import boundary from 'data/boundary.json'
import consul from 'data/consul.json'
import nomad from 'data/nomad.json'
import packer from 'data/packer.json'
import sentinel from 'data/sentinel.json'
import vagrant from 'data/vagrant.json'
import vault from 'data/vault.json'
import waypoint from 'data/waypoint.json'

let url = process.env.HASHI_DATO_ENVIRONMENT
	? `https://graphql.datocms.com/environments/${process.env.HASHI_DATO_ENVIRONMENT}`
	: 'https://graphql.datocms.com'

if (process.env.HASHI_ENV === 'preview') {
	url += '/preview'
}

const token = process.env.HASHI_DATO_TOKEN || '2f7896a6b4f1948af64900319aed60'

const globalConfig = {
	url,
	headers: { Authorization: token },
}

const productConfig = [
	boundary,
	consul,
	nomad,
	packer,
	sentinel,
	vagrant,
	vault,
	waypoint,
].reduce((a, b) => {
	a[b.slug] = b
	return a
}, {} as { [key in ProductSlug]: ProductData })

function rivetClient(config: {
	url?: string
	headers?: Record<string, unknown>
}) {
	const clientConfig = {
		...globalConfig,
		headers: {
			...globalConfig.headers,
			...config.headers,
		},
	}

	return rivet(clientConfig.url, {
		headers: clientConfig.headers,
		cors: true,
		retryCount: 3,
	})
}

const instance = rivetClient({})
const client = instance.client

function proxiedRivetClient(productSlug: ProductSlug) {
	const product = productConfig[productSlug]
	if (product.datoToken) {
		return rivetClient({ headers: { Authorization: product.datoToken } })
	}

	return instance
}

export default instance
export { productConfig, client, proxiedRivetClient }

/**
 *
 * NOTE: types defined below are only used here. Refer to ProductSlug and
 * ProductData from /src/data/types/products.ts if those are needed.
 *
 */

/**
 * The machine-readable versions of our products' names.
 */
type ProductSlug =
	| 'boundary'
	| 'consul'
	| 'nomad'
	| 'packer'
	| 'sentinel'
	| 'terraform'
	| 'vagrant'
	| 'vault'
	| 'waypoint'

/**
 * Global configuration for a product. Used to hold data that's used on
 * multiple pages.
 */
interface ProductData {
	/**
	 * The name of the product, in Proper Noun case. Used wherever the name of
	 * the product is presented to a human.
	 */
	name: string

	/**
	 * The name of the product, in lower case (and without spaces). Used wherever
	 * the name of the product is presented to a computer. Used in things like
	 * determining colors and other thematic elements; connecting to our content
	 * API; etc.
	 */
	slug: ProductSlug

	/**
	 * The configuration for our Algolia-powered docs search component.
	 * @see {@link AlgoliaConfig}
	 */
	algoliaConfig: AlgoliaConfig

	/**
	 * The configuration for analytics products such as Fathom and Segment.
	 * @see {@link AnalyticsConfig}
	 */
	analyticsConfig?: AnalyticsConfig

	/**
	 * The configuration for <meta> tags.
	 * @see {@link Metadata}
	 */
	metadata: Metadata

	/**
	 * Whether the AlertBanner should be displayed on every page.
	 */
	alertBannerActive: boolean

	/**
	 * The configuration for the AlertBanner.
	 * @see {@link AlertBanner}
	 */
	alertBanner: AlertBanner

	/**
	 * An array of items describing the primary top-level navigation.
	 * @see {@link SubnavItemClass}
	 */
	subnavItems: (SubnavItemClass | 'divider')[]

	/**
	 * The current release version for this product.
	 */
	version?: string

	/**
	 * The current release version for the Vagrant Vmware utility.
	 * (Vagrant Specific)
	 */
	vmwareUtilityVersion?: string

	/**
	 * The URL to a product's changelog. Used on the /downloads page
	 */
	changelogUrl?: string

	/**
	 * The configuration for the packageManager prop for a product's /download
	 * page. No longer used.
	 * @deprecated
	 * @see {@link PackageManager}
	 */
	packageManagers?: PackageManager[]

	/**
	 * A read-only Dato token used to query for product-specific data.
	 */
	datoToken?: string
}

interface AlertBanner {
	/**
	 * The text contained inside the tag to the left
	 */
	tag: string

	/**
	 * where to link to when clicked
	 */
	url: string

	/**
	 * The text in the main area
	 */
	text: string

	/**
	 * Secondary text styled as a link
	 */
	linkText: string

	/**
	 * A datetime string that, when set, controls if the alert banner should appear
	 */
	expirationDate: Date
}

interface AlgoliaConfig {
	/**
	 * The name of the Algolia index to query for this product, usually in the
	 * form of product_PRODUCTSLUG.
	 */
	indexName: string

	/**
	 * A search-only Algolia API key
	 */
	searchOnlyApiKey: string
}

interface AnalyticsConfig {
	/**
	 * A list of space-separated fully-qualified domain names for which to gather
	 * analytics.
	 */
	includedDomains: string

	/**
	 * A Segment API key with write permissions.
	 */
	segmentWriteKey: string
}

interface Metadata {
	/**
	 * The text to use as the defaut content for the <title> element for pages
	 * using this product configuration.
	 */
	title: string

	/**
	 * The text to use as the defaut content for the description element for
	 * pages using this product configuration.
	 */
	description: string

	/**
	 * The URL to an image to use in OpenGraph and Twitter meta tags.
	 */
	image: string

	/**
	 * A list of Icons to include in the <head> element.
	 * @see {@link Icon}
	 */
	icon: Icon[]
}

interface Icon {
	/**
	 * The URL to an image to use as a favicon
	 */
	href: string

	/**
	 * The mimetype for the image located at href.
	 */
	type?: string

	/**
	 * The dimensions of the image located at href in WxH form.
	 */
	sizes?: string
}

interface PackageManager {
	/**
	 * A human-friendly label used for this package manager.
	 */
	label: string

	/**
	 * An array of CLI commands used to install this product.
	 */
	commands: string[]

	/**
	 * The applicable operating system for this package manager.
	 */
	os: string
}

interface SubnavItemClass {
	/**
	 * The text displayed for this menu item
	 */
	text: string

	/**
	 * The URL to link this menu item to
	 */
	url?: string

	/**
	 * Whether this menu item is an inbound or outbound URL
	 */
	type?: 'inbound' | 'outbound'

	/**
	 * An array of submenu items
	 * @see {@link Submenu}
	 */
	submenu?: Submenu[]
}

interface Submenu {
	/**
	 * The text displayed for this menu item
	 */
	text: string

	/**
	 * The URL to link this menu item to
	 */
	url: string
}
