/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getTutorialSlug } from 'views/collection-view/helpers'
import { getIntegrationUrl } from 'lib/integrations'
// Types
import type { Hit } from 'instantsearch.js'

/**
 * Builds a URL path to an arbitrary hit from
 * our unified `<env>_DEVDOT_omni` Algolia indices.
 */
export function buildUrlPath(searchHit: Hit): string {
	if (searchHit.type === 'docs') {
		const objectIdWithoutType = searchHit.objectID.replace('docs_', '')
		return `/${objectIdWithoutType}`.replace(/\/index$/, '')
	} else if (searchHit.type === 'tutorial') {
		const { slug, defaultContext } = searchHit
		return getTutorialSlug(slug, defaultContext.slug)
	} else if (searchHit.type === 'integration') {
		const {
			external_only,
			external_url,
			product_slug,
			organization_slug,
			slug,
		} = searchHit
		/**
		 * TODO: refactor `getIntegrationUrl` to `Pick<>` what's actually needed.
		 * For now, using `$TSFixMe` to avoid inaccurate TS errors about what
		 * argument properties are needed for the function to work.
		 */
		return getIntegrationUrl({
			external_only,
			external_url,
			product: { slug: product_slug } as $TSFixMe,
			organization: { slug: organization_slug } as $TSFixMe,
			slug,
		} as $TSFixMe)
	} else if (searchHit.type === 'zendesk') {
		return `https://support.hashicorp.com/hc/articles/${searchHit.slug}`
	} else {
		/**
		 * Something's gone wrong, this should never happen in our indexing.
		 * Link to the home page as insurance. And ideally, should log
		 * an error here, not just locally, but maybe elsewhere?
		 *
		 * TODO: figure out where to log errors like this in such a way that
		 * they're surfaced to the team, rather than only appearing in-browser.
		 */
		console.error(
			`Unexpected input in build-url-path: content type "${searchHit.type}" is not a recognized content type. Valid content types are "docs", "tutorial", and "integration". Please ensure the object pushed to Algolia only use these content types.`
		)
		return '/'
	}
}
