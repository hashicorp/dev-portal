/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { TutorialLite as ClientTutorialLite } from 'lib/learn-client/types'
import { TutorialListItemProps } from 'components/tutorials-sidebar/types'
// A `.tsx` module exported in the barrel-export file (/helpers/index.ts) causes
// hc-tools to error, which breaks our `./scripts/warm-cache.ts`.
//
// To avoid this, we import from the specific file here to avoid unintended side effects.
import { getTutorialSlug } from 'views/collection-view/helpers/get-slug'

export function splitProductFromFilename(slug: string): string {
	return slug.split('/')[1]
}

// Handles variant routes that in the url show as query params,
// but are rewritten to static paths in middleware. We want to check
// against the default tutorial path for 'current', not with the variant
function cleanVariantFromPath(tutorialPath: string) {
	const currentPathParts = tutorialPath.split('/')
	// Expected variant tutorial path structure
	// /:product/tutorials/:collection/:tutorial/:variant
	const isVariantPath =
		currentPathParts.length === 6 && currentPathParts[5].includes(':')

	if (isVariantPath) {
		currentPathParts.pop()
	}

	return currentPathParts.join('/')
}

export function formatTutorialToMenuItem(
	tutorial: ClientTutorialLite,
	collection: {
		slug: string
		id: string
	},
	currentPath: string
): TutorialListItemProps {
	const path = getTutorialSlug(tutorial.slug, collection.slug)
	const currentPathWithoutVariant = cleanVariantFromPath(currentPath)

	return {
		tutorialId: tutorial.id,
		collectionId: collection.id,
		text: tutorial.shortName,
		href: path,
		isActive: path === currentPathWithoutVariant,
	}
}

export function generateCanonicalUrl(
	defaultCollectionSlug: string,
	tutorialSlug: string
): URL {
	const path = getTutorialSlug(tutorialSlug, defaultCollectionSlug)
	return new URL(path, __config.dev_dot.canonical_base_url)
}
