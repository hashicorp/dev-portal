import { AUTH_ENABLED } from 'hooks/use-authentication'
import { TutorialCardBookmarkButton } from 'components/bookmark-button'
import TutorialCard from '..'
import { TutorialCardPropsWithId } from '..'

export function TutorialCardWithBookmark(props: TutorialCardPropsWithId) {
	const { id: tutorialId, ...rest } = props

	return (
		<TutorialCard
			{...rest}
			eyebrowSlot={
				<>
					<span>{props.duration}</span>
					{/** Hide from prod until auth is enabled */}
					{AUTH_ENABLED ? (
						<TutorialCardBookmarkButton tutorialId={tutorialId} />
					) : null}
				</>
			}
		/>
	)
}
