/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Configure, Index } from 'react-instantsearch-hooks-web'
import { CommandBarDivider } from 'components/command-bar/components'
import { SuggestedPages } from '../../../components'
import { CustomHitsContainer } from '..'
import type { SearchableContentType } from 'contexts'
import s from './all-tab-contents.module.css'

function AllTabContents({
	currentProductTag,
	currentContentType = 'all',
	suggestedPages,
	noResultsMessageSlot,
}: {
	currentProductTag: $TSFixMe
	currentContentType?: SearchableContentType | 'all'
	suggestedPages: $TSFixMe
	noResultsMessageSlot: $TSFixMe
}) {
	const filters = []
	if (currentProductTag) {
		const { id } = currentProductTag
		filters.push(`products:${id}`)
	}

	// Filter by content type
	if (currentContentType) {
		const algoliaContentType = {
			docs: 'docs',
			tutorials: 'tutorial',
			integrations: 'integration',
		}[currentContentType]
		if (algoliaContentType) {
			filters.push(`type:${algoliaContentType}`)
		}
	}

	return (
		<Index indexName={__config.dev_dot.algolia.unifiedIndexName}>
			<Configure filters={filters.join(' AND ')} />
			<CustomHitsContainer
				type={currentContentType}
				noResultsSlot={
					<>
						{noResultsMessageSlot}
						<CommandBarDivider className={s.divider} />
						<SuggestedPages pages={suggestedPages} />
					</>
				}
			/>
		</Index>
	)
}

export default AllTabContents
