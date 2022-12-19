import { Product, ProductName, ProductSlug } from 'types/products'

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
}
