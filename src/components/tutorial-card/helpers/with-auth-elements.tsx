import { AUTH_ENABLED } from 'hooks/use-authentication'
import { TutorialCardBookmarkButton } from 'components/bookmark-button'
import TutorialCard from '..'
import { TutorialCardPropsWithId } from '..'
import ProgressIconAndLabel from '../components/progress-icon-and-label'

/**
 * TODO: perhaps "TutorialCardEyebrowWithAuth" is the component to make?
 * then if auth enabled and present, render that.
 * or fallback to a standard eyebrow component?
 */
export function TutorialCardWithAuthElements(props: TutorialCardPropsWithId) {
	const { id: tutorialId, collectionId, ...rest } = props

	return (
		<TutorialCard
			{...rest}
			eyebrowSlot={
				<>
					<span>
						{AUTH_ENABLED ? (
							<ProgressIconAndLabel
								tutorialId={tutorialId}
								collectionId={collectionId}
							/>
						) : null}
						<span>{props.duration}</span>
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
