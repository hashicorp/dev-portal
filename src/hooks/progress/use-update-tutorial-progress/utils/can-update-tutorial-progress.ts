import { UseTutorialProgressMutationsResult } from 'hooks/progress/use-tutorial-progress-mutations'
import {
	Collection,
	Tutorial,
	TutorialProgressStatus,
} from 'lib/learn-client/types'

function canUpdateTutorialProgress({
	startEntry,
	endEntry,
	tutorialId,
	collectionId,
	isAuthenticated,
	tutorialProgressStatus,
	tutorialProgressMutations,
}: {
	startEntry: IntersectionObserverEntry
	endEntry: IntersectionObserverEntry
	tutorialId: Tutorial['id']
	collectionId: Collection['id']
	isAuthenticated: boolean
	tutorialProgressStatus: TutorialProgressStatus
	tutorialProgressMutations: UseTutorialProgressMutationsResult
}): boolean {
	/**
	 * On initial client-side navigation, this effect may be called
	 * before startRefs and endRefs are updated. We can detect this
	 * by comparing data-ref-id attributes we've added to the
	 * elements startRef and endRef are attached to.
	 */
	const startRefId = startEntry?.target.getAttribute('data-ref-id')
	const endRefId = endEntry?.target.getAttribute('data-ref-id')
	const compareId = `${tutorialId}_${collectionId}`
	const isStaticIdsMismatch = startRefId !== compareId || endRefId !== compareId
	if (isStaticIdsMismatch) {
		return false
	}

	/**
	 * If we're not authenticated, we bail early, there's no
	 * point in trying to make a mutation.
	 */
	if (!isAuthenticated) {
		return false
	}

	/**
	 * If we are authenticated but we don't have a result
	 * yet from querying this tutorial's status, we also bail early.
	 * We need that result to know whether to "create" or "update".
	 */
	if (typeof tutorialProgressStatus == 'undefined') {
		return false
	}

	/**
	 * We don't want to run multiple mutations at once.
	 * To avoid this, tutorialProgressMutations provided `isReady`,
	 * which we respect here.
	 */
	const isReadyToRunMutation = tutorialProgressMutations.isReady
	if (!isReadyToRunMutation) {
		return false
	}

	/**
	 * Otherwise, we are ready to continue with a progress update
	 */
	return true
}

export { canUpdateTutorialProgress }
