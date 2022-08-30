import { useCollectionProgress } from 'hooks/progress'
import { Collection } from 'lib/learn-client/types'

interface TutorialProgressProps {
	completedTutorialCount: number
	totalTutorialCount: number
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
		collectionId,
		totalTutorialCount,
	}: {
		collectionId: Collection['id']
		totalTutorialCount: number
	}) {
		const { completedTutorialCount } = useCollectionProgress({
			collectionId,
		})
		return (
			<PresentationalComponent
				totalTutorialCount={totalTutorialCount}
				completedTutorialCount={completedTutorialCount}
			/>
		)
	}
}
