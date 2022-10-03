import { IconHistory16 } from '@hashicorp/flight-icons/svg-react/history-16'
import { useCommandBar } from 'components/command-bar'
import {
	CommandBarButtonListItem,
	CommandBarDivider,
	CommandBarList,
} from 'components/command-bar/components'
import { RecentSearch, RecentSearchesProps } from './types'

const RecentSearches = ({ recentSearches }: RecentSearchesProps) => {
	const { inputRef, setCurrentInputValue } = useCommandBar()

	if (!recentSearches || recentSearches.length === 0) {
		return null
	}

	return (
		<>
			<CommandBarList label="Recent Searches">
				{recentSearches.map((recentSearch: RecentSearch) => {
					return (
						<CommandBarButtonListItem
							key={recentSearch}
							icon={<IconHistory16 />}
							onClick={() => {
								setCurrentInputValue(recentSearch)
								inputRef.current.focus()
							}}
							title={recentSearch}
						/>
					)
				})}
			</CommandBarList>
			<CommandBarDivider />
		</>
	)
}

export type { RecentSearch, RecentSearchesProps }
export default RecentSearches
