import { useEffect } from 'react'
import { useCollectionProgress, useTutorialProgress } from 'hooks/progress'
import usePrevious from 'hooks/use-previous'
import { Collection, Tutorial } from 'lib/learn-client/types'
import makeProgressToast from './make-progress-toast'

/**
 * Given a tutorialId, collectionId, and count of tutorials in the collection,
 *
 * Show progress toast when the specified tutorial shifts from some other
 * status to "complete". This toast will give information related to
 * collection progress, which is why we need the count of tutorials
 * in the collection.
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
	// Keep track of current status, so when know when it hits "complete"
	const { tutorialProgressStatus } = useTutorialProgress({
		tutorialId,
		collectionId,
	})
	// Keep track of previous status so we can compare
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
		 * We need collectionProgress to accurately display toast.
		 * If there's no collectionProgress, there's no toast worth showing.
		 */
		if (typeof collectionProgress == 'undefined') {
			return
		}

		/**
		 * We need to compare to previous status to know if the change merits toast.
		 */
		if (!prevStatus) {
			return
		}

		/**
		 * If status has shifted to "complete", we'll show some toast
		 */
		const isTimeForToast =
			prevStatus !== 'complete' && tutorialProgressStatus === 'complete'

		const incompleteTutorials = collectionTutorialIds.filter((id) => {
			const isComplete = collectionProgress
				.filter((r) => r.complete_percent == '100')
				.map((r) => r.tutorial_id)
				.includes(id)
			return !isComplete
		})

		const otherIncompleteTutorials = incompleteTutorials.filter((id) => {
			return id !== tutorialId
		})
		const remainingTutorialsCount = otherIncompleteTutorials.length

		console.log(
			`progToast:\n${JSON.stringify(
				{
					isTimeForToast,
					prevStatus,
					tutorialProgressStatus,
					remainingTutorialsCount,
				},
				null,
				2
			)}`
		)

		/**
		 * If there are 0 remaining tutorials to complete in this collection,
		 * we'll show a toast with congrats on completing the collection.
		 * Otherwise, we'll show a toast with the remaining tutorials count.
		 */
		if (isTimeForToast) {
			makeProgressToast(remainingTutorialsCount)
		}
	}, [
		collectionProgress,
		prevStatus,
		collectionTutorialIds,
		tutorialId,
		tutorialProgressStatus,
	])
}
