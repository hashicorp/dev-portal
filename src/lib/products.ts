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
 * 🚨 NOTE: the order of this object matters for the Home page.
 */
const productSlugsToNames: { [slug in ProductSlug]: ProductName } = {
	sentinel: 'Sentinel',
	hcp: 'HashiCorp Cloud Platform',
	terraform: 'Terraform',
	packer: 'Packer',
	consul: 'Consul',
	vault: 'Vault',
	boundary: 'Boundary',
	nomad: 'Nomad',
	waypoint: 'Waypoint',
	vagrant: 'Vagrant',
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
 * An array of product slugs which are "active" on the site. Currently all but sentinel.
 */
const activeProductSlugs = productSlugs.filter((slug) => slug !== 'sentinel')

/**
 * Generates an array of Product objects from `productSlugs`.
 */
const products: Product[] = productSlugs.map((slug: ProductSlug) => {
	const name = productSlugsToNames[slug]
	return { name, slug }
})

export {
	activeProductSlugs,
	isProductSlug,
	products,
	productSlugs,
	productSlugsToHostNames,
	productSlugsToNames,
	navigationData,
	navPromo,
	sidePanelContent,
}
