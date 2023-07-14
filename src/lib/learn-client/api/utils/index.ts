/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { z } from 'zod'
import { identifier, slug } from 'lib/learn-client/types'

function formatSlug(slug: slug) {
	return slug.replace('/', '|')
}

function isUuid(id: string) {
	return z.string().uuid().safeParse(id).success
}

// if the identifier is a slug, we need to format for the request to replace slashes (/) with pipes (|)
export function formatIdentifier(idOrSlug: identifier): identifier {
	let identifier = idOrSlug

	if (!isUuid(identifier)) {
		identifier = formatSlug(idOrSlug)
	}

	return identifier
}

export function formatBatchQueryStr(
	idsOrSlugs: string[],
	withContent?: boolean
): string {
	const params = new URLSearchParams()
	const identifiers = idsOrSlugs.toString()

	if (idsOrSlugs.length > 0) {
		// Assuming here that if the first item in the array is a uuid, they are all uuids
		if (isUuid(idsOrSlugs[0])) {
			params.append('ids', identifiers)
		} else {
			params.append('slugs', identifiers)
		}
	}

	if (withContent) {
		params.append('full', '1')
	}

	return `?${params.toString()}`
}

// Barrel exports. This function can be imported from /utils
export * from './fetch-all'
