import { ProductSlug } from 'types/products'

const DEFAULT_COMMUNITY_FORUM_LINK = 'https://discuss.hashicorp.com/'
const DEFAULT_GITHUB_LINK = 'https://github.com/hashicorp'
const DEFAULT_SUPPORT_LINK = 'https://www.hashicorp.com/customer-success'

const COMMUNITY_LINKS_BY_PRODUCT: { [key in ProductSlug]: string } = {
	boundary: 'https://discuss.hashicorp.com/c/boundary/50',
	consul: 'https://discuss.hashicorp.com/c/consul/29',
	hcp: 'https://discuss.hashicorp.com/c/hcp/54',
	nomad: 'https://discuss.hashicorp.com/c/nomad/28',
	packer: 'https://discuss.hashicorp.com/c/packer/23',
	sentinel: 'https://discuss.hashicorp.com/c/sentinel/25',
	terraform: 'https://discuss.hashicorp.com/c/terraform-core/27',
	vagrant: 'https://discuss.hashicorp.com/c/vagrant/24',
	vault: 'https://discuss.hashicorp.com/c/vault/30',
	waypoint: 'https://discuss.hashicorp.com/c/waypoint/51',
}

const GITHUB_LINKS_BY_PRODUCT_SLUG: { [key in ProductSlug]: string } = {
	boundary: 'https://github.com/hashicorp/boundary',
	consul: 'https://github.com/hashicorp/consul',
	hcp: DEFAULT_GITHUB_LINK,
	nomad: 'https://github.com/hashicorp/nomad',
	packer: 'https://github.com/hashicorp/packer',
	sentinel: DEFAULT_GITHUB_LINK,
	terraform: 'https://github.com/hashicorp/terraform',
	vagrant: 'https://github.com/hashicorp/vagrant',
	vault: 'https://github.com/hashicorp/vault',
	waypoint: 'https://github.com/hashicorp/waypoint',
}

/**
 * Generates additional sidebar nav items for the Resources section. If an
 * `additional-sidebar-resources.json` file exists for a product in the
 * `src/content` directory, and it has the correct data structure, the specified
 * nav items will be appended to the Resources section.
 */
const generateAdditionalResources = (productSlug?: ProductSlug) => {
	if (productSlug) {
		try {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			return require(`content/${productSlug}/additional-sidebar-resources.json`)
		} catch {
			return []
		}
	}

	return []
}

/**
 * Generates the sidebar nav items for the Resources section of the sidebar.
 * Optionally accepts a Product slug for customization of links.
 */
const generateResourcesNavItems = (productSlug?: ProductSlug) => {
	const additionalResources = generateAdditionalResources(productSlug)

	return [
		{ heading: 'Resources' },
		{
			title: 'Community Forum',
			href: productSlug
				? COMMUNITY_LINKS_BY_PRODUCT[productSlug]
				: DEFAULT_COMMUNITY_FORUM_LINK,
		},
		{
			title: 'Support',
			href: DEFAULT_SUPPORT_LINK,
		},
		{
			title: 'GitHub',
			href: productSlug
				? GITHUB_LINKS_BY_PRODUCT_SLUG[productSlug]
				: DEFAULT_GITHUB_LINK,
		},
		...additionalResources,
	]
}

export { generateResourcesNavItems }
