/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'
import { certificationProgramSlugMap } from 'views/certifications/content/utils/program-slug-map'
import {
	VALID_EDITION_SLUGS_FOR_FILTERING,
	VALID_PRODUCT_SLUGS_FOR_FILTERING,
} from 'views/tutorial-library/constants'

/**
 * Note: these ResourceNav types could probably be abstracted up or lifted out,
 * but for now, since the functions here had very little type information,
 * felt pragmatic to declare them just for this file.
 */

type ResourceNavLink = {
	title: string
	href: string
}
type ResourceNavHeading = {
	heading: string
}
type ResourceNavItem = ResourceNavLink | ResourceNavHeading

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

const GITHUB_LINKS_BY_PRODUCT_SLUG: {
	[key in Exclude<ProductSlug, 'waypoint'>]: string
} = {
	boundary: 'https://github.com/hashicorp/boundary',
	consul: 'https://github.com/hashicorp/consul',
	hcp: DEFAULT_GITHUB_LINK,
	nomad: 'https://github.com/hashicorp/nomad',
	packer: 'https://github.com/hashicorp/packer',
	sentinel: DEFAULT_GITHUB_LINK,
	terraform: 'https://github.com/hashicorp/terraform',
	vagrant: 'https://github.com/hashicorp/vagrant',
	vault: 'https://github.com/hashicorp/vault',
}

/**
 * Generates additional sidebar nav items for the Resources section. If an
 * `additional-sidebar-resources.json` file exists for a product in the
 * `src/content` directory, and it has the correct data structure, the specified
 * nav items will be appended to the Resources section.
 */
function generateAdditionalResources(
	productSlug?: ProductSlug
): ResourceNavItem[] {
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
 * Given a product slug,
 * Return a link to the Tutorials Library with filters applied
 * that correspond to that product.
 */
function getTutorialLibraryUrl(productSlug?: ProductSlug): string {
	const baseUrl = '/tutorials/library'
	if (!productSlug) {
		return baseUrl
	}
	if (VALID_PRODUCT_SLUGS_FOR_FILTERING.includes(productSlug)) {
		return `${baseUrl}/?product=${productSlug}`
	} else if (VALID_EDITION_SLUGS_FOR_FILTERING.includes(productSlug)) {
		return `${baseUrl}/?edition=${productSlug}`
	} else {
		return baseUrl
	}
}

/**
 * Given a product slug,
 * Return an array of resource links.
 *
 * If we have a corresponding certification program page to link to,
 * we return that single link item in an array.
 *
 * If the given product does not have a certifications page,
 * we return an empty array.
 */
function getCertificationsLink(productSlug?: ProductSlug): ResourceNavLink[] {
	// If this product does not have a certifications link, return an empty array
	const programSlug = certificationProgramSlugMap[productSlug]
	if (!programSlug) {
		return []
	}
	// If this product does have a certifications link, return a single-item array
	const link = {
		title: 'Certifications',
		href: `/certifications/${programSlug}`,
	}
	return [link]
}

/**
 * Generates the sidebar nav items for the Resources section of the sidebar.
 * Optionally accepts a Product slug for customization of links.
 */
function generateResourcesNavItems(
	productSlug?: ProductSlug
): ResourceNavItem[] {
	const additionalResources = generateAdditionalResources(productSlug)

	return [
		{ heading: 'Resources' },
		...(productSlug !== 'sentinel'
			? [
					{
						// Add a "Tutorials" link for all products except Sentinel
						title: 'Tutorial Library',
						href: getTutorialLibraryUrl(productSlug),
					},
			  ]
			: []),
		...getCertificationsLink(productSlug),
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
		...(productSlug !== 'waypoint'
			? [
					{
						title: 'GitHub',
						href: productSlug
							? GITHUB_LINKS_BY_PRODUCT_SLUG[productSlug]
							: DEFAULT_GITHUB_LINK,
					},
			  ]
			: []),
		...additionalResources,
	]
}

export { generateResourcesNavItems }
