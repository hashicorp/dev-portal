import {
	TutorialProgressMutationArgs,
	UseTutorialProgressMutationsResult,
} from 'hooks/progress/use-tutorial-progress-mutations'
import {
	Collection,
	Tutorial,
	TutorialProgressPercent,
} from 'lib/learn-client/types'

/**
 * Fires off either a create or update mutation to record tutorial progress.
 */
function updateTutorialProgress({
	tutorialId,
	collectionId,
	tutorialProgressMutations,
	needsInitialProgress,
	completePercent,
}: {
	tutorialId: Tutorial['id']
	collectionId: Collection['id']
	tutorialProgressMutations: UseTutorialProgressMutationsResult
	needsInitialProgress: boolean
	completePercent: TutorialProgressPercent
}) {
	/**
	 * We'll use the same mutation arguments for "create" or "update".
	 */
	const mutationArgs: TutorialProgressMutationArgs = {
		tutorialId,
		collectionId,
		completePercent,
	}
	/**
	 * If we need an initial progress record, we create a new record.
	 * Otherwise, we'll update the existing record.
	 */
	if (needsInitialProgress) {
		tutorialProgressMutations.createTutorialProgress(mutationArgs)
	} else {
		tutorialProgressMutations.updateTutorialProgress(mutationArgs)
	}
}

export { updateTutorialProgress }
