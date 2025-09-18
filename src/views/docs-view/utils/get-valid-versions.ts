/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */
// Types
import type { VersionSelectItem } from '../loaders/remote-content'


/**
 * Given a list of all possible versions, as well as a document path and
 * content repo identifier for our content API,
 * Return a filter list of versions that includes only those versions
 * where this document exists.
 *
 * To determine in which versions this document exists, we make a request
 * to a content API that returns a list of strings representing known versions.
 * We use this to filter out unknown versions from our incoming version list.
 */
export async function getValidVersions(
	/**
	 * An array of version select items representing all possible versions for
	 * the content source repository in question (`productSlugForLoader`).
	 * May be undefined or empty if versioned docs are not enabled, for example
	 * during local preview.
	 */
	versions: VersionSelectItem[] = [],
	/**
	 * A identifier for the document, consumable by our content API.
	 * For markdown documents, this is `doc#` followed by the full path of the
	 * document within the content source repository.
	 */
	fullPath: string,

	/**
	 * The product slug for the document, consumable by our content API.
	 * The naming here is difficult, as the actual function here is to identify
	 * specific content source repositories. These are often but not always
	 * product slugs. For example Terraform has multiple content source repos
	 * for different parts of the product.
	 */
	slug: string
): Promise<VersionSelectItem[]> {
	const minimumVersions = {
		boundary: 'v0.13.x',
		consul: 'v1.18.x',
		nomad: 'v1.8.x',
		packer: 'v1.13.x',
		vagrant: 'v2.4.7',
		vault: 'v1.16.x',
		waypoint: 'v0.11.x',
		// Terraform sub-products (i.e: terraform-*)
		['terraform-cli']: 'v1.1.x',
		['terraform-cdk']: 'v0.21.x',
		['terraform-enterprise']: 'v202408-1',
		['terraform-plugin-framework']: 'v1.15.x',
		['terraform-language']: 'v1.1.x',
	};

	let product: string;
	if(fullPath.includes('cli')) {
		product = `${slug}-${fullPath.replace(/doc#/, '')}`;
	} else if (fullPath === 'doc#language') {
		product = 'terraform-language';
	} else {
		product = slug;
	}
	console.log({ fullPath, slug, product })
	const minimumVersionIndex = versions
		.findIndex(({ version }) => version == minimumVersions[product]);
	return versions.map((option, index) => ({
		...option,
		found: index <= minimumVersionIndex
	}))
}
