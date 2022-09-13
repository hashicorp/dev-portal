import { CommandBarDivider } from 'components/command-bar/components'
import SuggestedPages from '../../suggested-pages'
import NoResultsMessage from '../no-results-message'
import { DocumentationTabContentsProps } from './types'
import s from './documentation-tab-contents.module.css'

const DocumentationTabContents = ({
	searchResults,
	suggestedPages,
}: DocumentationTabContentsProps) => {
	return searchResults.length === 0 ? (
		<>
			<NoResultsMessage />
			<CommandBarDivider className={s.divider} />
			<SuggestedPages pages={suggestedPages} />
		</>
	) : (
		<p>TODO show docs results</p>
	)
}

export default DocumentationTabContents
