import { Index } from 'react-instantsearch-hooks-web'
import { CommandBarDivider } from 'components/command-bar/components'
import { CustomHitsContainer, NoResultsMessage, SuggestedPages } from '../'
import { DocumentationTabContentsProps } from './types'
import s from './documentation-tab-contents.module.css'

const DocumentationTabContents = ({
	suggestedPages,
}: DocumentationTabContentsProps) => {
	return (
		<Index indexName="product_DEVDOT">
			<CustomHitsContainer
				noResultsSlot={
					<>
						<NoResultsMessage />
						<CommandBarDivider className={s.divider} />
						<SuggestedPages pages={suggestedPages} />
					</>
				}
				type="documentation"
			/>
		</Index>
	)
}

export default DocumentationTabContents
