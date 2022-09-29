import { IconHistory16 } from '@hashicorp/flight-icons/svg-react/history-16'
import {
	CommandBarButtonListItem,
	CommandBarDivider,
	CommandBarList,
} from 'components/command-bar/components'
import { RecentSearch, RecentSearchesProps } from './types'

const RecentSearches = ({ recentSearches }: RecentSearchesProps) => {
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
							onClick={() => console.log('clicked', recentSearch)}
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
