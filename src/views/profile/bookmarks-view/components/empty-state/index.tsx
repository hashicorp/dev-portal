import { IconBookmarkAdd16 } from '@hashicorp/flight-icons/svg-react/bookmark-add-16'
import ButtonLink from 'components/button-link'
import Heading from 'components/heading'
import IconTile from 'components/icon-tile'
import Text from 'components/text'
import s from './empty-state.module.css'

export default function BookmarksEmptyState() {
	return (
		<div className={s.wrapper}>
			<IconTile size="small">
				<IconBookmarkAdd16 />
			</IconTile>
			<Heading level={2} size={300} weight="semibold" className={s.heading}>
				You have no saved bookmarks.
			</Heading>
			<Text className={s.subheading}>
				You can select the bookmark icon on any tutorial card to save it for
				future reference.
			</Text>
			<ButtonLink
				href="/library"
				text="Tutorial library"
				className={s.buttonLink}
			/>
		</div>
	)
}
