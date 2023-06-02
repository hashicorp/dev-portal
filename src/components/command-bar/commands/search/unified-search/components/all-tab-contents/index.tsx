/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Configure, Index } from 'react-instantsearch-hooks-web'
import { CommandBarDivider } from 'components/command-bar/components'
import { SuggestedPages } from '../../../components'
import { CustomHitsContainer } from '..'
import s from './all-tab-contents.module.css'

function AllTabContents({
	currentProductTag,
	suggestedPages,
	noResultsMessageSlot,
}: {
	currentProductTag: $TSFixMe
	suggestedPages: $TSFixMe
	noResultsMessageSlot: $TSFixMe
}) {
	const filters = []
	if (currentProductTag) {
		const { id } = currentProductTag
		filters.push(`products:${id}`)
	}

	return (
		<Index indexName={__config.dev_dot.algolia.unifiedIndexName}>
			<Configure filters={filters.join(' AND ')} />
			<CustomHitsContainer
				type="all"
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
