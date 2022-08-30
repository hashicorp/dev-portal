import { useTutorialProgress } from 'hooks/progress'
import {
	Collection,
	Tutorial,
	TutorialProgressLabel,
} from 'lib/learn-client/types'

interface TutorialProgressProps {
	tutorialProgressLabel: TutorialProgressLabel | null
}

/**
 * This higher-order-components serves as a 'controller'
 * for rendering the various states of tutorial progress.
 * It accepts a presentational component to render, and
 * fetches the tutorial progress state.
 */
export function ConnectTutorialProgressComponent(
	PresentationalComponent: React.FC<TutorialProgressProps>
) {
	return function ConnectedTutorialProgressComponent({
		tutorialId,
		collectionId,
	}: {
		tutorialId: Tutorial['id']
		collectionId: Collection['id']
	}) {
		const { tutorialProgressLabel } = useTutorialProgress({
			tutorialId,
			collectionId,
		})
		return (
			<PresentationalComponent tutorialProgressLabel={tutorialProgressLabel} />
		)
	}
}
