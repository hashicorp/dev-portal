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
	versions: VersionSelectItem[],
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
	productSlugForLoader: string
): Promise<VersionSelectItem[]> {
	// If versions are falsy or empty, we can skip the API calls and return []
	if (!versions || versions.length === 0) {
		return []
	} else {
		const minimumVersions = new Map<string, string>([
			['boundary', 'v0.13.x'],
			['consul', 'v1.18.x'],
			['nomad', 'v1.8.x'],
			['packer', 'v1.13.x'],
			['vagrant', 'v2.4.7'],
			['vault', 'v1.16.x'],
			['waypoint', 'v0.11.x'],
		]);
		const minimumVersionIndex = versions
			.findIndex((version) => version.label === minimumVersions.get(productSlugForLoader));

		return versions.map((option, index) => ({
			...option,
			found: index <= minimumVersionIndex
		}))
	}
}
