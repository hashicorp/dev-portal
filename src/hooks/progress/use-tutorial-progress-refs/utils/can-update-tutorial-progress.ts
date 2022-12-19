import { UseTutorialProgressMutationsResult } from 'hooks/progress/use-tutorial-progress-mutations'
import {
	Collection,
	Tutorial,
	TutorialProgressStatus,
} from 'lib/learn-client/types'

/**
 * Determines whether conditions are right for updating tutorial progress.
 *
 * We need to account for a variety of factors in the useEffect that triggers
 * tutorial progress updates, such as authenticated status, and client-side
 * navigation which updates tutorialId and collectionId before query data
 * or refs are updated (since ids are part of static props).
 *
 * As a result, the useEffect is triggered very often, but it's only
 * under particular conditions that running the progress update
 * will  have the intended effect.
 */
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
	 * If we're not authenticated, we bail early, there's no
	 * point in trying to make a mutation.
	 */
	if (!isAuthenticated) {
		return false
	}

	/**
	 * If this tutorial is already "complete", we know we won't
	 * want to change that progress, so we can bail early.
	 */
	if (tutorialProgressStatus == 'complete') {
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
	 * Otherwise, we are ready to continue with a progress update
	 */
	return true
}

export { canUpdateTutorialProgress }
