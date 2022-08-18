import { AUTH_ENABLED } from 'hooks/use-authentication'
import { TutorialCardBookmarkButton } from 'components/bookmark-button'
import TutorialCard from '..'
import { TutorialCardProps } from '..'

interface TutorialCardWithBookmarkProps extends TutorialCardProps {
	isBookmarked: boolean
}

export function TutorialCardWithBookmark(props: TutorialCardWithBookmarkProps) {
	return (
		<TutorialCard
			{...props}
			eyebrowSlot={
				<>
					<span>{props.duration}</span>
					{/** Hide from prod until auth is enabled */}
					{AUTH_ENABLED ? (
						<TutorialCardBookmarkButton isBookmarked={props.isBookmarked} />
					) : null}
				</>
			}
		/>
	)
}
