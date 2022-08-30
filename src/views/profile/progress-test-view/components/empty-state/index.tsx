import { IconBookmarkAdd16 } from '@hashicorp/flight-icons/svg-react/bookmark-add-16'
import ButtonLink from 'components/button-link'
import Heading from 'components/heading'
import IconTile from 'components/icon-tile'
import Text from 'components/text'
import s from './empty-state.module.css'

export default function ProgressEmptyState() {
	return (
		<div className={s.wrapper}>
			<IconTile size="small">
				<IconBookmarkAdd16 />
			</IconTile>
			<Heading level={2} size={300} weight="semibold" className={s.heading}>
				You have no progress yet
			</Heading>
			<Text className={s.subheading}>
				You can make progress on any tutorial by visiting a tutorial page, and
				scrolling. Viewing at least a bit of the tutorial content will mark it
				as {'"in progress"'}. Viewing all of the tutorial content will mark it
				as
				{'"completed"'}.
			</Text>
			<ButtonLink
				href="/tutorials/library"
				text="Tutorial library"
				className={s.buttonLink}
			/>
		</div>
	)
}
