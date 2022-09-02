import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import useAuthentication from 'hooks/use-authentication'
// Tutorial progress utilities
import { progressStatusToPercent } from 'lib/learn-client/api/progress/formatting'
import {
	useTutorialProgress,
	useTutorialProgressMutations,
} from 'hooks/progress'
import { canUpdateTutorialProgress, updateTutorialProgress } from './utils'
// Types
import {
	TutorialIdCollectionId,
	TutorialProgressStatus,
} from 'lib/learn-client/types'

type IntersectionRef = (node?: Element) => void

interface UpdateProgressReturnInterface {
	startRef: IntersectionRef
	endRef: IntersectionRef
}

/**
 * Given a tutorialId and collectionId,
 * Return two refs in an object, { startRef, endRef },
 * which can be placed on elements to track tutorial progress.
 *
 * On initial load, and when visibility of these refs changes,
 * we recalculate progress, and update with any forward progress.
 *
 * If the endRef element is within the viewport,
 * which means we're close to the bottom of the page,
 * the tutorial will be marked as `complete` (100 percent).
 *
 * If the startRef element is not within the viewport,
 * which means we've scrolled at least partway down the page,
 * the tutorial will be marked as `in_progress` (50 percent).
 *
 * Otherwise, the tutorial will be marked as `visited` (0 percent).
 *
 */
export function useTutorialProgressRefs({
	tutorialId,
	collectionId,
}: TutorialIdCollectionId): UpdateProgressReturnInterface {
	// We shouldn't try to update progress unless we're authenticated
	const { isAuthenticated } = useAuthentication()
	// We need to know if progress exists, to know whether to "create" or "update"
	const { tutorialProgressStatus } = useTutorialProgress({
		tutorialId,
		collectionId,
	})
	// We'll use "create" or "update" progress using these `react-query` mutations
	const tutorialProgressMutations = useTutorialProgressMutations()
	// We use refs from `react-intersection-observer` to track progress.
	const [startRef, startInView, startEntry] = useInView({
		initialInView: true,
	})
	const [endRef, endInView, endEntry] = useInView()

	/**
	 * This effect runs often, but it seems necessary to ensure progress
	 * gets tracked as things like the authenticated state changes.
	 *
	 * We bail early in many cases, and we avoid downgrading progress,
	 * so this effect only results in meaningful mutations a small percent
	 * of the time.
	 */
	useEffect(() => {
		/**
		 * Exit early if any conditions exist which would make it a bad idea to
		 * try to update progress. See canUpdateTutorialProgress for details.
		 */
		if (
			!canUpdateTutorialProgress({
				startEntry,
				endEntry,
				tutorialId,
				collectionId,
				isAuthenticated,
				tutorialProgressStatus,
				tutorialProgressMutations,
			})
		) {
			return
		}

		/**
		 * Determine the new progress state, which we'll then update
		 * - 'complete' (100%) if the end ref is visible
		 * - 'in_progress' (50%) if the start ref is no longer visible
		 * - 'visited' (0%) in all other cases
		 */
		let newProgressStatus: TutorialProgressStatus
		if (endInView) {
			newProgressStatus = TutorialProgressStatus.complete
		} else if (!startInView) {
			newProgressStatus = TutorialProgressStatus.in_progress
		} else {
			newProgressStatus = TutorialProgressStatus.visited
		}

		/**
		 * If we have positive progress, or need to record initial progress,
		 * then we create or update our progress (formatted as percent for the API).
		 *
		 * Note that we don't ever downgrade the percent value of progress.
		 */
		const existingPercent = progressStatusToPercent(tutorialProgressStatus)
		const newPercent = progressStatusToPercent(newProgressStatus)
		const hasPositiveProgress = parseInt(newPercent) > parseInt(existingPercent)
		// We won't see positive progress initially (0 > 0 == false)
		const needsInitialProgress = tutorialProgressStatus === null
		if (needsInitialProgress || hasPositiveProgress) {
			// Update progress, either with a "create" or "update" mutation
			updateTutorialProgress({
				tutorialId,
				collectionId,
				tutorialProgressMutations,
				needsInitialProgress,
				completePercent: newPercent,
			})
		}
	}, [
		// Tutorial and collection IDs, these change on client-side navigation
		tutorialId,
		collectionId,
		// Start and end refs
		startInView,
		endInView,
		endEntry,
		startEntry,
		// Authentication
		isAuthenticated,
		// Queried status for this tutorial, informs "create" vs "update"
		tutorialProgressStatus,
		// Result of useTutorialProgressMutations
		tutorialProgressMutations,
	])

	return { startRef, endRef }
}
