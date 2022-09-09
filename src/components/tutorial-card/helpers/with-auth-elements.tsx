import { AUTH_ENABLED } from 'hooks/use-authentication'
import { useTutorialProgress } from 'hooks/progress'
import { TutorialCardBookmarkButton } from 'components/bookmark-button'
import TutorialCard, { TutorialCardPropsWithId } from '..'
import { LeadingEyebrow } from '../components/leading-eyebrow'

/**
 * Displays a TutorialCard, which shows additional user-data-specific elements
 * for authenticated users.
 */
export function TutorialCardWithAuthElements(props: TutorialCardPropsWithId) {
	const { id: tutorialId, collectionId, ...rest } = props

	/**
	 * Get tutorial progress. Will be undefined if not authenticated.
	 * Note as well that useTutorialProgress depends on AUTH_ENABLED.
	 */
	const { tutorialProgressStatus } = useTutorialProgress({
		tutorialId,
		collectionId,
	})

	return (
		<TutorialCard
			{...rest}
			eyebrowSlot={
				<>
					<span>
						<LeadingEyebrow
							tutorialProgressStatus={tutorialProgressStatus}
							duration={props.duration}
						/>
					</span>
					{/** Hide from prod until auth is enabled */}
					{AUTH_ENABLED ? (
						<TutorialCardBookmarkButton
							tutorial={{ id: tutorialId, name: props.heading }}
						/>
					) : null}
				</>
			}
		/>
	)
}
