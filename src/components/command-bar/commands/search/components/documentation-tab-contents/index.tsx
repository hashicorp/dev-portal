/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Configure, Index } from 'react-instantsearch-hooks-web'
import { CommandBarDivider } from 'components/command-bar/components'
import { CustomHitsContainer, NoResultsMessage, SuggestedPages } from '../'
import { DocumentationTabContentsProps } from './types'
import s from './documentation-tab-contents.module.css'

const DocumentationTabContents = ({
	currentProductTag,
	suggestedPages,
	activeTabIndex,
	setActiveTabIndex,
	handleKeyUp,
	tabData,
}: DocumentationTabContentsProps) => {
	let filters
	if (currentProductTag) {
		const { id } = currentProductTag
		filters = `product:${id}`
	}

	return (
		<Index indexName={__config.dev_dot.algolia.docsIndexName}>
			<Configure filters={filters} />
			<CustomHitsContainer
				noResultsSlot={
					<>
						<NoResultsMessage
							activeTabIndex={activeTabIndex}
							setActiveTabIndex={setActiveTabIndex}
							handleKeyUp={handleKeyUp}
							tabData={tabData}
						/>
						<CommandBarDivider className={s.divider} />
						<SuggestedPages pages={suggestedPages} />
					</>
				}
				type="docs"
			/>
		</Index>
	)
}

export default DocumentationTabContents
