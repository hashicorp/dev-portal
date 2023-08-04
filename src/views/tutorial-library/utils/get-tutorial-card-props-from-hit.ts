/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { TutorialHitObject } from 'components/command-bar/commands/search/unified-search/types'
import { TutorialCardPropsWithId } from 'components/tutorial-card'
import getReadableTime from 'components/tutorial-meta/components/badges/helpers'
import { getTutorialSlug } from 'views/collection-view/helpers'

/**
 * Results
 *
 * @TODO can we de-dupe with formatTutorialCard from 'components/tutorial-card/helpers'? The search result has `.products`, where
 * as the helper expects `.productsUsed`
 */
export function getTutorialCardPropsFromHit(
	hit: TutorialHitObject
): TutorialCardPropsWithId {
	return {
		id: hit.id,
		collectionId: hit.defaultContext.id,
		url: getTutorialSlug(hit.slug, hit.defaultContext.slug),
		duration: getReadableTime(hit.readTime),
		heading: hit.page_title,
		description: hit.description,
		productsUsed: hit.products,
		hasVideo: hit.hasVideo,
		hasInteractiveLab: hit.isInteractive,
	}
}
