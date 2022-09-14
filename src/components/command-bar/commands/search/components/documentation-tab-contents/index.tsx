import { productSlugsToNames } from 'lib/products'
import {
	CommandBarDivider,
	CommandBarLinkListItem,
	CommandBarList,
} from 'components/command-bar/components'
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
		<>
			<div
				id="documentation-search-results-label"
				className="g-screen-reader-only"
			>
				Documentation search results
			</div>
			<CommandBarList ariaLabelledBy="documentation-search-results-label">
				{searchResults.map((hit) => {
					const { objectID, _highlightResult, product } = hit
					const { page_title, description } = _highlightResult
					const resultUrl = `/${product}/${objectID}`
					const productName =
						product === 'hcp' ? 'HCP' : productSlugsToNames[product]

					return (
						<CommandBarLinkListItem
							key={objectID}
							title={page_title?.value}
							description={description?.value}
							url={resultUrl}
							badges={[productName]}
						/>
					)
				})}
			</CommandBarList>
		</>
	)
}

export default DocumentationTabContents
