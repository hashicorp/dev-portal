import { Collection, TutorialLite } from 'lib/learn-client/types'
import { ApiCollectionTutorialProgress } from 'lib/learn-client/api/api-types'
import { getTutorialSlug } from 'views/collection-view/helpers'

/**
 * Given progress data for a particular collection,
 * and a count of all tutorials in that collection,
 * Return booleans representing collection progress state.
 */
function parseCollectionProgress(
	progressData: ApiCollectionTutorialProgress[],
	tutorials: TutorialLite[],
	collection: Pick<Collection, 'id' | 'slug'>
) {
	/**
	 * The basics
	 */
	const tutorialCount = tutorials.length
	const completedTutorialCount = countCompletedRecords(
		progressData || [],
		collection.id
	)
	const isCompleted = completedTutorialCount == tutorialCount
	const isInProgress = completedTutorialCount > 0 && !isCompleted
	/**
	 * Tutorial CTA
	 */
	const tutorialCta = getNextTutorialCta({
		progressData,
		tutorials,
		collectionSlug: collection.slug,
		isCompleted,
		isInProgress,
	})
	/**
	 * Status label
	 */
	let statusLabel: string
	if (isCompleted) {
		statusLabel = 'Complete'
	} else if (isInProgress) {
		statusLabel = `${completedTutorialCount}/${tutorialCount}`
	} else {
		statusLabel = `${tutorialCount} tutorial${tutorialCount == 1 ? '' : 's'}`
	}
	/**
	 * Return it all
	 */
	return {
		completedTutorialCount,
		isCompleted,
		isInProgress,
		statusLabel,
		tutorialCount,
		tutorialCta,
	}
}

/**
 * Given an array of progress records, and a collection.id,
 * Return the count of records that are completed in that collection.
 */
function countCompletedRecords(
	progressData: ApiCollectionTutorialProgress[],
	collectionId: Collection['id']
): number {
	return progressData.filter((record: ApiCollectionTutorialProgress) => {
		return (
			record.collection_id == collectionId && record.complete_percent == '100'
		)
	}).length
}

/**
 * Given progress and tutorial data for particular collection,
 * Return a CTA object that links to the "next tutorial" in the collection.
 *
 * For in-progress collections, the "next tutorial" is the first tutorial
 * in the collection that does not have "complete" as its progress status.
 *
 * For completed collections, and for all unauthenticated cases,
 * the "next tutorial" is the first tutorial in the collection.
 */
function getNextTutorialCta({
	progressData,
	tutorials,
	isCompleted,
	isInProgress,
	collectionSlug,
}: {
	progressData: ApiCollectionTutorialProgress[]
	tutorials: TutorialLite[]
	isCompleted: boolean
	isInProgress: boolean
	collectionSlug: Collection['slug']
}) {
	/**
	 * If we're not authenticated or have no progress,
	 * we'll use the first tutorial.
	 *
	 * If we do have progress data, we return the first incomplete tutorial,
	 * or if all tutorials are complete, then the first tutorial.
	 */
	let targetTutorial
	if (isCompleted || !progressData) {
		targetTutorial = tutorials[0]
	} else {
		const firstIncompleteTutorial = tutorials.find((tutorial: TutorialLite) => {
			const matchedProgress = progressData.find(
				(record: ApiCollectionTutorialProgress) =>
					record.tutorial_id == tutorial.id
			)
			const isIncomplete =
				!matchedProgress || matchedProgress.complete_percent !== '100'
			return isIncomplete
		})
		targetTutorial = firstIncompleteTutorial
	}
	/**
	 * Construct a CTA link from the target tutorial
	 */
	const { slug, name } = targetTutorial
	const href = getTutorialSlug(slug, collectionSlug)
	if (isCompleted) {
		return {
			href,
			text: 'Review',
			ariaLabel: `Review ${name}`,
		}
	} else if (isInProgress) {
		return {
			href,
			text: 'Continue',
			ariaLabel: `Continue with ${name}`,
		}
	} else {
		return {
			href,
			text: 'Start',
			ariaLabel: `Start with ${name}`,
		}
	}
}

export { parseCollectionProgress }
