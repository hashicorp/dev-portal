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
	tutorialCount: number,
	collection: Pick<Collection, 'id' | 'slug'>
) {
	/**
	 * The basics
	 */
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
	 * Return it all
	 */
	return {
		completedTutorialCount,
		isCompleted,
		isInProgress,
		tutorialCount,
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
	const targetTutorial = getNextTutorial({
		isCompleted,
		progressData,
		tutorials,
	})
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

/**
 * Given an array of tutorials, and an array of progressData,
 * as well as a progressMatchFn that runs against the matched
 * progressData record for each tutorial (if there is one),
 *
 * Return the first tutorial that meets the progressMatchFn criteria.
 *
 * Note that for tutorials without matched progressData,
 * progressMatchFn() will be called with `undefined`.
 */
function findTutorialByProgress(
	tutorials: TutorialLite[],
	progressData: ApiCollectionTutorialProgress[],
	progressMatchFn: (matchedProgress) => boolean
) {
	return tutorials.find((tutorial: TutorialLite) => {
		const matchedProgress = progressData.find(
			(record: ApiCollectionTutorialProgress) =>
				record.tutorial_id == tutorial.id
		)
		return progressMatchFn(matchedProgress)
	})
}
/**
 * Determine the "next tutorial" in a collection.
 *
 * For in-progress collections, the "next tutorial" is the first tutorial
 * in the collection that does not have "complete" as its progress status.
 *
 * For completed collections, and for all unauthenticated cases,
 * the "next tutorial" is the first tutorial in the collection.
 */
function getNextTutorial({
	isCompleted,
	progressData,
	tutorials,
}: {
	isCompleted: boolean
	progressData: ApiCollectionTutorialProgress[]
	tutorials: TutorialLite[]
}): TutorialLite {
	if (isCompleted || !progressData) {
		/**
		 * If we're not authenticated or have no progress,
		 * we'll use the first tutorial.
		 */
		return tutorials[0]
	} else {
		/**
		 * If we do have progress data, we look for the first in-progress tutorial.
		 * Note: we may skip tutorials with no progress, and "visited" tutorials,
		 * in order to return the first "in_progress" tutorial.
		 */
		const firstInProgressTutorial = findTutorialByProgress(
			tutorials,
			progressData,
			(progress) =>
				progress &&
				progressPercentToStatus(progress.complete_percent) ==
					TutorialProgressStatus.in_progress
		)
		if (firstInProgressTutorial) {
			return firstInProgressTutorial
		}
		/**
		 * If there's no "in_progress" tutorial, we find the first incomplete
		 * tutorial. Note: This could be a tutorial without a progress record,
		 * or it could be a "visited" tutorial.
		 */
		const firstIncompleteTutorial = findTutorialByProgress(
			tutorials,
			progressData,
			(progress) =>
				!progress ||
				progressPercentToStatus(progress.complete_percent) ==
					TutorialProgressStatus.visited
		)
		if (firstIncompleteTutorial) {
			return firstIncompleteTutorial
		}
		/**
		 * If there are no incomplete tutorials, then all tutorials are
		 * complete. We return the first tutorial.
		 */
		return tutorials[0]
	}
}

export { getNextTutorial, getNextTutorialCta, parseCollectionProgress }
