/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import slugify from 'slugify'

function generateSlug(headline: string, links: string[] = []) {
	let slug = slugify(headline, { lower: true })

	// count if there are any duplicates on the page
	const dupeCount = links.reduce((m, i) => {
		if (slug === i) {
			m++
		}
		return m
	}, 0)
	/**
	 * TODO: find a way to not modify `links` as a side-effect.
	 */
	links.push(slug)

	// append the count to the end of the slug if necessary
	/**
	 * TODO: refactor this, not as bulletproof as it could be:
	 *
	 * For example, if there's a document with `## Hello 1` and `## Hello` and
	 * another `## Hello` heading, we end up with a slug collision:
	 * - First `## Hello 1` is visited, its slug is set as `hello-1`
	 * - Next `## Hello` is visited, dupeCount==0, slug is set as `hello`
	 * - Next the second `## Hello` is visited, dupeCount==1, and the
	 *   slug is set as `hello-1`, which conflicts with a previous slug.
	 *
	 * Rather than count duplicates, we could:
	 * - accept an array of `usedSlugs`, which we WON'T modify
	 * - if usedSlugs.indexOf(slug) === -1, no need to dedupe, return slug
	 *   otherwise...
	 *
	 * let dedupedSlug = slug
	 * let dedupeIndex = 0
	 * while (usedSlugs.indexOf(dedupedSlug) !== -1) {
	 *   dedupeIndex++
	 *   dedupedSlug = `${slug}-${dedupeIndex}`
	 * }
	 * return dedupedSlug
	 *
	 * (could potentially imagine a mildly more efficient version that uses
	 * a regex to detect the max dedupeIndex so far, and just +1 that rather
	 * than using a while look, but seems like that'd be more error-prone,
	 * and that it'd be only slightly more efficient, as generally we expect
	 * usually zero or at most a relatively small count of duplicates.)
	 *
	 */

	if (dupeCount > 0) {
		slug = `${slug}-${dupeCount}`
	}

	return slug
}

export default generateSlug
