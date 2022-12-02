import {
	CommandBarLinkListItem,
	CommandBarList,
} from 'components/command-bar/components'
import { SuggestedPage, SuggestedPagesProps } from './types'

const SuggestedPages = ({ pages }: SuggestedPagesProps) => {
	return (
		<CommandBarList label="Suggested Pages">
			{pages.map((page: SuggestedPage) => (
				<CommandBarLinkListItem
					key={page.url}
					icon={page.icon}
					title={page.text}
					url={page.url}
				/>
			))}
		</CommandBarList>
	)
}

export type { SuggestedPage, SuggestedPagesProps }
export default SuggestedPages
