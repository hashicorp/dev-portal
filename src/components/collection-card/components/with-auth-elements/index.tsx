import { AUTH_ENABLED } from 'hooks/use-authentication'
import CollectionProgressBar from '../collection-progress-bar'
import CollectionCard, {
	CollectionCardPropsWithId,
} from 'components/collection-card'

/**
 * TODO: perhaps "CollectionCardEyebrowWithAuth" is the component to make?
 * then if auth enabled and present, render that.
 * or fallback to a standard eyebrow component?
 */
export function CollectionCardWithAuthElements(
	props: CollectionCardPropsWithId
) {
	return (
		<CollectionCard
			{...props}
			eyebrowSlot={
				AUTH_ENABLED ? (
					<CollectionProgressBar
						collectionId={props.id}
						totalTutorialCount={props.tutorialCount}
					/>
				) : undefined
			}
		/>
	)
}
