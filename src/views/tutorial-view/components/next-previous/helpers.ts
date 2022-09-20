import {
	Collection as ClientCollection,
	CollectionLite as ClientCollectionLite,
	TutorialLite as ClientTutorialLite,
} from 'lib/learn-client/types'
import { NextPreviousProps } from '.'

interface GetNextPreviousParams {
	currentTutorialSlug: string
	currentCollection: ClientCollection
	nextCollectionInSidebar: ClientCollectionLite
	formatting: {
		getCollectionSlug(collectionSlug): string
		getTutorialSlug(tutorialSlug: string, collectionSlug: string): string
	}
}

export function getNextPrevious({
	currentTutorialSlug,
	currentCollection,
	nextCollectionInSidebar,
	formatting,
}: GetNextPreviousParams): NextPreviousProps {
	let previousTutorial
	let nextTutorial
	let nextCollection
	const tutorialIndex = currentCollection.tutorials.findIndex(
		(t: ClientTutorialLite) => t.slug === currentTutorialSlug
	)
	const isFirstTutorial = tutorialIndex === 0
	const isLastTutorial =
		tutorialIndex === currentCollection.tutorials.length - 1

	if (!isFirstTutorial) {
		const { slug, name } = currentCollection.tutorials[tutorialIndex - 1]
		previousTutorial = {
			path: formatting.getTutorialSlug(slug, currentCollection.slug),
			name,
		}
	}

	if (!isLastTutorial) {
		const { slug, name } = currentCollection.tutorials[tutorialIndex + 1]
		nextTutorial = {
			path: formatting.getTutorialSlug(slug, currentCollection.slug),
			name,
		}
	}

	if (nextCollectionInSidebar) {
		nextCollection = {
			path: formatting.getCollectionSlug(nextCollectionInSidebar.slug),
			name: nextCollectionInSidebar.shortName,
		}
	}

	/**
	 * @TODO - interim state for 'final' link
	 * This link shows on the last tutorial in the last collection in sidebar order
	 * In learn, it links to a filtered advanced search page state
	 * e.g. https://learn.hashicorp.com/search?product=waypoint&page=1
	 *
	 * Since don't have an advanced search page for beta,
	 * were linking folks back to the baseproduct tutorials page.
	 *
	 */
	let finalLink = `/${currentCollection.theme}/tutorials`
	const currentCollectionSection = currentCollection.slug.split('/')[0]

	if (currentCollectionSection === 'well-architected-framework') {
		finalLink = '/well-architected-framework'
	} else if (currentCollectionSection === 'onboarding') {
		/** @TODO - remove this once the tutorial library is released */
		finalLink = 'https://learn.hashicorp.com/search'
	}

	const tutorial = {
		previous: previousTutorial,
		next: nextTutorial,
		isLast: isLastTutorial,
	}

	const collection = {
		current: {
			path: formatting.getCollectionSlug(currentCollection.slug),
			name: currentCollection.shortName,
		},
		next: nextCollection,
		isLast: isLastTutorial && !nextCollection, // if next collection isn't defined and were on the last tutorial, the api returned null
	}

	return {
		tutorial,
		collection,
		finalLink,
	}
}
