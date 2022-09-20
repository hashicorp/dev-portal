import {
	Collection,
	TutorialLite,
	TutorialProgressStatus,
} from 'lib/learn-client/types'
import { ApiCollectionTutorialProgress } from 'lib/learn-client/api/api-types'
import { getTutorialSlug } from 'views/collection-view/helpers'
import { progressPercentToStatus } from 'lib/learn-client/api/progress'

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
	const inProgressTutorialCount = countProgressedRecords(
		progressData || [],
		collection.id,
		TutorialProgressStatus.in_progress
	)
	const completedTutorialCount = countProgressedRecords(
		progressData || [],
		collection.id,
		TutorialProgressStatus.complete
	)
	const isCompleted = completedTutorialCount == tutorialCount
	const isInProgress = inProgressTutorialCount > 0 || completedTutorialCount > 0
	/**
	 * Tutorial CTA
	 */
	const tutorialCta = getNextTutorialCta({
		progressData,
		tutorials,
		collectionSlug: collection.slug,
		isCompleted,
		isInProgress,
		completedTutorialCount,
		tutorialCount,
	})
	/**
	 * Return it all
	 */
	return {
		completedTutorialCount,
		isCompleted,
		isInProgress,
		tutorialCount,
		tutorialCta,
	}
}

/**
 * Given an array of progress records, and a collection.id,
 * Return the count of records that are completed in that collection.
 */
function countProgressedRecords(
	progressData: ApiCollectionTutorialProgress[],
	collectionId: Collection['id'],
	targetProgress: TutorialProgressStatus
): number {
	return progressData.filter((record: ApiCollectionTutorialProgress) => {
		return (
			record.collection_id == collectionId &&
			progressPercentToStatus(record.complete_percent) == targetProgress
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
	completedTutorialCount,
	tutorialCount,
}: {
	progressData: ApiCollectionTutorialProgress[]
	tutorials: TutorialLite[]
	isCompleted: boolean
	isInProgress: boolean
	collectionSlug: Collection['slug']
	completedTutorialCount: number
	tutorialCount: number
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
		const firstInProgressTutorial = tutorials.find((tutorial: TutorialLite) => {
			const matchedProgress = progressData.find(
				(record: ApiCollectionTutorialProgress) =>
					record.tutorial_id == tutorial.id
			)
			const isInProgress =
				matchedProgress &&
				progressPercentToStatus(matchedProgress.complete_percent) ==
					TutorialProgressStatus.in_progress
			return isInProgress
		})
		targetTutorial = firstInProgressTutorial || tutorials[0]
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
			ariaLabel: `Review ${name}. All tutorials completed.`,
		}
	} else if (isInProgress) {
		return {
			href,
			text: 'Continue',
			ariaLabel: `Continue with ${name}. ${completedTutorialCount} out of ${tutorialCount} tutorial${
				tutorialCount == 1 ? '' : 's'
			} completed.`,
		}
	} else {
		return {
			href,
			text: 'Start',
			ariaLabel: `Start with ${name}. ${tutorialCount} tutorial${
				tutorialCount == 1 ? '' : 's'
			} in this collection.`,
		}
	}
}

export { parseCollectionProgress }
