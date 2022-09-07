import { useEffect } from 'react'
import { useCollectionProgress, useTutorialProgress } from 'hooks/progress'
import usePrevious from 'hooks/use-previous'
import { Collection, Tutorial } from 'lib/learn-client/types'
import makeProgressToast from './make-progress-toast'

/**
 * Given a tutorialId, collectionId, and count of tutorials in the collection,
 *
 * Show progress toast when the specified tutorial changes progress,
 * from some non-"complete" status to "complete".
 *
 * This toast will give information related to collection progress,
 * which is why we need the array of tutorial IDs in the collection.
 */
export function useProgressToast({
	tutorialId,
	collectionId,
	collectionTutorialIds,
}: {
	tutorialId: Tutorial['id']
	collectionId: Collection['id']
	collectionTutorialIds: Tutorial['id'][]
}): void {
	/**
	 * Keep track of current progress, so when know when it hits "complete".
	 */
	const { tutorialProgressStatus } = useTutorialProgress({
		tutorialId,
		collectionId,
	})

	/**
	 * Keep track of previous progress status, so we can detect change.
	 */
	const prevStatus = usePrevious(tutorialProgressStatus)

	/**
	 * If this is the last incomplete tutorial in a collection,
	 * then when it becomes complete, we'll make *special* toast.
	 */
	const { data: collectionProgress } = useCollectionProgress({ collectionId })

	/**
	 * When tutorialProgressStatus changes, we might need to show toast.
	 */
	useEffect(() => {
		/**
		 * We need to compare to previous status to know if the change merits toast.
		 * If we don't have prevStatus, we can't be certain about change.
		 */
		if (typeof prevStatus == 'undefined') {
			return
		}

		/**
		 * We need collectionProgress to accurately display toast.
		 * If there's no collectionProgress, there's no toast worth showing.
		 */
		if (typeof collectionProgress == 'undefined') {
			return
		}

		/**
		 * If status has shifted to "complete", we'll show some toast.
		 */
		const isTimeForToast =
			prevStatus !== 'complete' && tutorialProgressStatus === 'complete'
		if (!isTimeForToast) {
			return
		}

		/**
		 * Even if the collection progress query isn't up to date yet, we know from
		 * `tutorialProgressStatus` that this tutorial is definitely complete.
		 * So we filter it out regardless of its completion status.
		 */
		const otherTutorialsInCollection = collectionTutorialIds.filter((id) => {
			return id !== tutorialId
		})

		/**
		 * Using the collection progress records, we filter and count
		 * the remaining non-"complete" tutorials in this collection
		 */
		const completedTutorialIds = collectionProgress
			.filter((r) => r.complete_percent == '100')
			.map((r) => r.tutorial_id)
		const remainingTutorialsCount = otherTutorialsInCollection.filter((id) => {
			const isComplete = completedTutorialIds.includes(id)
			return !isComplete
		}).length

		/**
		 * If there are 0 remaining tutorials to complete in this collection,
		 * we'll show a toast with congrats on completing the collection.
		 * Otherwise, we'll show a toast with the remaining tutorials count.
		 */
		makeProgressToast(remainingTutorialsCount)
	}, [
		collectionProgress,
		prevStatus,
		collectionTutorialIds,
		tutorialId,
		tutorialProgressStatus,
	])
}
