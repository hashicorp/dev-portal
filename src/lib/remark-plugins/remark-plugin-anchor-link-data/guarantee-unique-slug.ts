/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import slugify from 'slugify'

/**
 * Given a string to be made into a slug,
 * and given an array of existing slugs with which our new slug cannot collide,
 *
 * Return a slug version of the provided string which is guaranteed
 * to not collide with any strings in the existing slugs array.
 */
function guaranteeUniqueSlug(string: string, existingSlugs: string[]): string {
	const slug = slugify(string, { lower: true })
	// If there's no collision, return the basic slug
	if (existingSlugs.indexOf(slug) === -1) {
		return slug
	}
	// Otherwise, there is a collision.We'll append `-<index>` to the basic slug.
	let uniqueSlug = slug
	let uniqueIndex = 0
	/**
	 * While we can still find our slug in the existingSlugs array,
	 * increment our uniqueIndex suffix and check again.
	 *
	 * Note: there are potentially more efficient ways of doing this,
	 * for example by matching existing <slug>-<index> values, finding
	 * the largest `index` value by parsing integers from all matches,
	 * and finally incrementing that `index` value. However, the efficiency
	 * gains in this case do not seem worth the potential error-prone-ness
	 * and relative complexity of using regex and parsing integers.
	 */
	while (existingSlugs.indexOf(uniqueSlug) !== -1) {
		uniqueIndex++
		uniqueSlug = `${slug}-${uniqueIndex}`
	}
	// Return the slug with the uniqueIndex suffix.
	return uniqueSlug
}

export default guaranteeUniqueSlug
