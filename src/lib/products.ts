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
 * Specifically, with iterate over the `Object.keys()` of this object
 * in the following places:
 * 
 * - generate-top-level-sub-nav-items (for the main nav)
 * - getStaticPaths (for /<product>/docs landing pages)
 * - VALID_PRODUCT_SLUGS_FOR_FILTERING (for Tutorials Library sidebar filter)
 * - getTutorialLandingPaths (for tutorials included in the sitemap)
 * - getStaticPaths (for individual tutorials pages)
 * - generateProductTutorialHomePaths (for /<product>/tutorials landing pages)
 
 * 
 * We already have at least one instance (for HCP Vault secrets) where we've
 * avoided adding to this constant because of how it's intertwined with other
 * purposes. It might make sense for us to refactor some code so that we're
 * only ever using this constant as a way to get the product name from a given
 * product slug. Specifically:
 * 
 * - In Tutorials instances, maybe we could fetch from the Tutorials API
 *   to determine which products are available for filtering or appropriate
 *   to include in the sitemap, rather that using a hard-coded constant?
 * - In 
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
