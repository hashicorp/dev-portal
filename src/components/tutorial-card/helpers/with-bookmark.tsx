import { AUTH_ENABLED } from 'hooks/use-authentication'
import { TutorialCardBookmarkButton } from 'components/bookmark-button'
import { handleAddOrRemoveBookmark } from './handle-add-or-remove-bookmark'
import TutorialCard, { TutorialCardPropsWithId } from '..'

interface TutorialCardWithBookmarkProps extends TutorialCardPropsWithId {
	isBookmarked: boolean
}

export function TutorialCardWithBookmark(props: TutorialCardWithBookmarkProps) {
	const { isBookmarked, id, ...rest } = props

	return (
		<TutorialCard
			{...rest}
			eyebrowSlot={
				<>
					<span>{props.duration}</span>
					{/** Hide from prod until auth is enabled */}
					{AUTH_ENABLED ? (
						<TutorialCardBookmarkButton
							isBookmarked={isBookmarked}
							handleAddOrRemoveBookmark={() =>
								handleAddOrRemoveBookmark(isBookmarked, id)
							}
						/>
					) : null}
				</>
			}
		/>
	)
}
