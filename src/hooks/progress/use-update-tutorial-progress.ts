import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import useAuthentication from 'hooks/use-authentication'
// Tutorial progress utilities
import { progressStatusToPercent } from 'lib/learn-client/api/progress/formatting'
import {
	useTutorialProgress,
	useTutorialProgressMutations,
	TutorialProgressMutationArgs,
} from 'hooks/progress'
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
 * On initial load, regardless of startRef or endRef visibility,
 * if the tutorial does not yet have recorded progress,
 * the tutorial will be marked as `visited` (0 percent).
 *
 * When the startRef element moves out of the viewport,
 * the tutorial will be marked as `in_progress` (50 percent).
 *
 * When the endRef element moves into the viewport,
 * the tutorial will be marked as `complete` (100 percent).
 */
export function useUpdateTutorialProgress({
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
		 * On initial client-side navigation, this effect may be called
		 * before startRefs and endRefs are updated. We can detect this
		 * by comparing data-ref-id attributes we've added to the
		 * elements startRef and endRef are attached to.
		 */
		const startRefId = startEntry?.target.getAttribute('data-ref-id')
		const endRefId = endEntry?.target.getAttribute('data-ref-id')
		const compareId = `${tutorialId}_${collectionId}`
		const isStaticIdsMismatch =
			startRefId !== compareId || endRefId !== compareId

		console.log({
			isStaticIdsMismatch,
			startInView,
			endInView,
			startRefId,
			endRefId,
			compareId,
		})
		if (isStaticIdsMismatch) {
			return
		}

		/**
		 * If we're not authenticated, we bail early, there's no
		 * point in trying to make a mutation.
		 */
		if (!isAuthenticated) {
			return
		}

		/**
		 * If we are authenticated but we don't have a result
		 * yet from querying this tutorial's status, we also bail early.
		 * We need that result to know whether to "create" or "update".
		 */
		if (typeof tutorialProgressStatus == 'undefined') {
			return
		}

		/**
		 * We don't want to run multiple mutations at once.
		 * To avoid this, tutorialProgressMutations provided `isReady`,
		 * which we respect here.
		 */
		const isReadyToRunMutation = tutorialProgressMutations.isReady
		if (!isReadyToRunMutation) {
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
			/**
			 * We'll use the same mutation arguments for "create" or "update".
			 */
			const mutationArgs: TutorialProgressMutationArgs = {
				tutorialId,
				collectionId,
				completePercent: newPercent,
			}
			/**
			 * If we need an initial progress record, we create a new record.
			 * Otherwise, we'll update the existing record.
			 */
			let requestType: string
			if (needsInitialProgress) {
				requestType = 'CREATED'
				tutorialProgressMutations.createTutorialProgress(mutationArgs)
			} else {
				requestType = 'UPDATED'
				tutorialProgressMutations.updateTutorialProgress(mutationArgs)
			}

			console.log(`${requestType} progress: ${newProgressStatus}`)
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
