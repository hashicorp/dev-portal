import { TutorialLite as ClientTutorialLite } from 'lib/learn-client/types'
import { TutorialListItemProps } from 'components/tutorials-sidebar/types'
import { getTutorialSlug } from 'views/collection-view/helpers'

export function splitProductFromFilename(slug: string): string {
	return slug.split('/')[1]
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

	return {
		tutorialId: tutorial.id,
		collectionId: collection.id,
		text: tutorial.name,
		href: path,
		isActive: path === currentPath,
	}
}

export function generateCanonicalUrl(
	defaultCollectionSlug: string,
	tutorialSlug: string
): URL {
	const path = getTutorialSlug(tutorialSlug, defaultCollectionSlug)
	return new URL(path, __config.dev_dot.canonical_base_url)
}
