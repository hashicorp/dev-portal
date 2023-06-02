/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Configure, Index } from 'react-instantsearch-hooks-web'
import { CommandBarDivider } from 'components/command-bar/components'
import { SuggestedPages } from '../../../components'
import { CustomHitsContainer } from '../'
import { DocumentationTabContentsProps } from './types'
import s from './documentation-tab-contents.module.css'

const DocumentationTabContents = ({
	currentProductTag,
	suggestedPages,
	noResultsMessageSlot,
}: DocumentationTabContentsProps) => {
	const filters = []
	if (currentProductTag) {
		const { id } = currentProductTag
		filters.push(`products:${id}`)
	}

	// only want docs in this tab
	filters.push(`type:docs`)

	return (
		<Index indexName={__config.dev_dot.algolia.unifiedIndexName}>
			<Configure filters={filters.join(' AND ')} />
			<CustomHitsContainer
				noResultsSlot={
					<>
						{noResultsMessageSlot}
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
