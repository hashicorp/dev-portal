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
	// TODO: maybe find a way not to modify `links` as a side-effect?
	links.push(slug)

	// append the count to the end of the slug if necessary
	if (dupeCount > 0) {
		slug = `${slug}-${dupeCount}`
	}

	return slug
}

export default generateSlug
