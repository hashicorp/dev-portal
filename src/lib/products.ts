/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	Product,
	ProductName,
	ProductSlug,
	ProductNavData,
	ProductNavPromo,
	ProductSidePanel,
} from 'types/products'

/**
 * A map of product slugs to their proper noun names.
 *
 * 🚨 NOTE: the order of the keys in this object matters. It determines
 * the order in which products are displayed in certain locations.
 * The inclusion of product slugs in this map also has many side effects.
 * Specifically, we iterate over the `Object.keys()` of this object
 * in the following places:
 *
 * LANDING PAGE RELATED USES (assumes link to `/<product>`)
 * - generate-top-level-sub-nav-items.ts (all "mobile" menus)
 * - getAllProductsNavItems (home page and old products dropdown)
 * - PRODUCT_LINK_CARDS (for 404 pages)
 * - <Chiclets /> (used on the home page)
 *
 * DOCS-RELATED USES (assumes link to `/<product>/docs`)
 * - getStaticPaths (for `/<product>/docs` landing pages)
 * - warm-cache.ts - warmDeveloperDocsCache (relates to /<product>/docs)
 * - normalizeRemoteLoaderSlug (relates to /<product>/docs)
 * - rewrite-tutorial-links.test.ts (devDotDocsPath)
 * - getProductUrlAdjuster - this was intended for use during migration, after
 *   which MDX content would be updated to avoid having to rewrite links. The
 *   MDX content rewrite never happened, i think cause versioned docs made it
 *   seem impossible to execute in a reasonable way. So, authors still write
 *   links as if the content exists on dot-io domains. The root issue here is
 *   something that'll hopefully be much easier to fix once we've migrated
 *   content to `hashicorp/web-unified-docs`. In the meantime, it'd probably
 *   still be worth it to use a more specific dot-io-targeted variable.
 * - rewrite-docs-url.test.ts (tests getProductUrlAdjuster)
 *
 * TUTORIAL-RELATED USES (assumes link to `/<product>/tutorials`)
 * - warm-cache.ts - anonymous function (relates to tutorialUrls)
 * - VALID_PRODUCT_SLUGS_FOR_FILTERING (for Tutorials Library sidebar filter)
 *    - via productSlugsToNames, really only uses slugs
 * - getTutorialLandingPaths (for tutorials included in the sitemap)
 * - getStaticPaths (for individual [...tutorialSlug] pages)
 * - generateProductTutorialHomePaths (for /<product>/tutorials landing pages)
 * - rewrite-tutorial-links.test.ts (devDotTutorialsPath)
 *
 * TYPE ASSERTION USES
 * - isProductSlug - this feels like it might be used as generic assertion
 *   across content types. It might be helpful to create more specific type
 *   guards, eg `isProductSlugWithLogo`, `isProductSlugWithDocs`,
 *   `isProductSlugWithLandingPage`, `isProductSlugWithTutorials`,
 *   `isProductSlugWithIntegrations`, etc.
 *
 * LEGACY DOT-IO MIGRATION USES (assumes a dot-io site existed for the product)
 * - getIsRewriteableDocsLink (and related tests)
 * - rewrite-tutorial-links tests ("Links to .io home pages are not rewritten")
 *
 * We already have at least one instance (for HCP Vault secrets) where we've
 * avoided adding to this constant because of how it's intertwined with other
 * purposes. It probably makes sense for us to refactor some code so that we're
 * only ever using this constant as a way to get the product name from a given
 * product slug (where "product slug" is any valid product slug across any
 * use case).
 *
 * For all other uses cases, it might feel duplicative, but one approach might
 * be to explicitly declare new constants for each use case. Or maybe, since
 * much of these use cases rely on data that could be encoded in our existing
 * `src/data/<product>.json` files, we'd could gather everything related to
 * each product in those files, and derive the maps we need from the already
 * exported `PRODUCT_DATA_MAP`. Or maybe there's some other approach that we
 * could use to simplify our setup... It feels a bit convoluted right now.
 */
const productSlugsToNames: { [slug in ProductSlug]: ProductName } = {
	hcp: 'HashiCorp Cloud Platform',
	terraform: 'Terraform',
	packer: 'Packer',
	consul: 'Consul',
	vault: 'Vault',
	boundary: 'Boundary',
	nomad: 'Nomad',
	waypoint: 'Waypoint',
	vagrant: 'Vagrant',
	sentinel: 'Sentinel',
}

/**
 * A map of product slugs to their "dot io" site hostname.
 */
const productSlugsToHostNames: { [slug in ProductSlug]: string } = {
	boundary: 'boundaryproject.io',
	consul: 'consul.io',
	hcp: 'cloud.hashicorp.com',
	nomad: 'nomadproject.io',
	packer: 'packer.io',
	sentinel: 'docs.hashicorp.com',
	terraform: 'terraform.io',
	vagrant: 'vagrantup.com',
	vault: 'vaultproject.io',
	waypoint: 'waypointproject.io',
}

const navigationData: ProductNavData = [
	{
		title: 'Infrastructure Lifecycle Management',
		products: [
			{
				product: 'Terraform',
				url: '/terraform',
				description: 'Manage infrastructure as code',
			},
			{
				product: 'Packer',
				url: '/packer',
				description: 'Build machine images',
			},
			{
				product: 'Nomad',
				url: '/nomad',
				description: 'Orchestrate workloads',
			},
			{
				product: 'Waypoint',
				url: '/waypoint',
				description: 'Standardize application patterns',
			},
			{
				product: 'Vagrant',
				url: '/vagrant',
				description: 'Build developer environments',
			},
		],
	},
	{
		title: 'Security Lifecycle Management',
		products: [
			{
				product: 'Vault',
				url: '/vault',
				description: 'Centrally manage secrets',
			},
			{
				product: 'Boundary',
				url: '/boundary',
				description: 'Secure remote access',
			},
			{
				product: 'HCP Vault Secrets',
				url: '/hcp/docs/vault-secrets',
				description: 'Manage secrets as a service',
			},
			{
				product: 'Consul',
				url: '/consul',
				description: 'Secure network services',
			},
			{
				product: 'HCP Vault Radar',
				url: '/hcp/docs/vault-radar',
				description: 'Scan for embedded secrets',
			},
		],
	},
]

const mobileNavigationData: ProductNavData = [
	{
		title: 'Infrastructure Lifecycle Management',
		products: [
			{
				product: 'Terraform',
				url: '/terraform',
				description: 'Manage infrastructure as code',
			},
			{
				product: 'Packer',
				url: '/packer',
				description: 'Build machine images',
			},
			{
				product: 'Nomad',
				url: '/nomad',
				description: 'Orchestrate workloads',
			},
			{
				product: 'Waypoint',
				url: '/waypoint',
				description: 'Standardize application patterns',
			},
			{
				product: 'Vagrant',
				url: '/vagrant',
				description: 'Build developer environments',
			},
		],
	},
	{
		title: 'Security Lifecycle Management',
		products: [
			{
				product: 'Vault',
				url: '/vault',
				description: 'Centrally manage secrets',
			},
			{
				product: 'HCP Vault Secrets',
				url: '/hcp/docs/vault-secrets',
				description: 'Manage secrets as a service',
			},
			{
				product: 'HCP Vault Radar',
				url: '/hcp/docs/vault-radar',
				description: 'Scan for embedded secrets',
			},
			{
				product: 'Boundary',
				url: '/boundary',
				description: 'Secure remote access',
			},
			{
				product: 'Consul',
				url: '/consul',
				description: 'Secure network services',
			},
		],
	},
]

const navPromo: ProductNavPromo = {
	title: 'HashiCorp Cloud Platform',
	description: 'Get started in minutes with our cloud products',
	linkUrl: '/hcp',
	linkTitle: 'All HCP Products',
	icon: 'hashicorp',
	theme: 'default',
}

const sidePanelContent: ProductSidePanel = {
	label: 'Learn',
	navItems: [
		{
			title: 'Certifications',
			description: 'Get HashiCorp certified',
			url: '/certifications',
			icon: 'award',
		},
		{
			title: 'Tutorials',
			description: 'Learn HashiCorp products',
			url: '/tutorials',
			icon: 'learn',
		},
		{
			title: 'Well-Architected Framework',
			description: 'Adopt HashiCorp best practices',
			url: '/well-architected-framework',
			icon: 'layers',
		},
	],
}
/**
 * Type guard to determine if a string is a ProductSlug
 *
 * TODO: should we define ProductSlug as an enum,
 * so that we can use its values directly here?
 */
function isProductSlug(string: string): string is ProductSlug {
	return Object.keys(productSlugsToNames).includes(string as ProductSlug)
}

/**
 * An array of all Product slugs, generated from `productSlugsToNames`.
 */
const productSlugs = Object.keys(productSlugsToNames) as ProductSlug[]

/**
 * Generates an array of Product objects from `productSlugs`.
 */
const products: Product[] = productSlugs.map((slug: ProductSlug) => {
	const name = productSlugsToNames[slug]
	return { name, slug }
})

export {
	isProductSlug,
	products,
	productSlugs,
	productSlugsToHostNames,
	productSlugsToNames,
	navigationData,
	mobileNavigationData,
	navPromo,
	sidePanelContent,
}
