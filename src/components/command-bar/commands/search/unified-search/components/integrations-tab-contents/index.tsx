/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Configure, Index } from 'react-instantsearch-hooks-web'
import { TabContentsCta } from '../../../components'
import { CustomHitsContainer } from '..'
import { IconPipeline16 } from '@hashicorp/flight-icons/svg-react/pipeline-16'

function IntegrationsTabContents({
	currentProductTag,
	noResultsMessageSlot,
}: {
	currentProductTag: $TSFixMe
	noResultsMessageSlot: $TSFixMe
}) {
	const filters = []
	if (currentProductTag) {
		const { id } = currentProductTag
		filters.push(`products:${id}`)
	}

	filters.push(`type:integration`)

	return (
		<Index indexName={__config.dev_dot.algolia.unifiedIndexName}>
			<Configure filters={filters.join(' AND ')} />
			<CustomHitsContainer
				type="integrations"
				noResultsSlot={noResultsMessageSlot}
			/>
			{currentProductTag ? (
				<TabContentsCta
					href={`/${currentProductTag.id}/integrations`}
					icon={<IconPipeline16 />}
					text={`See all ${currentProductTag.text} integrations`}
				/>
			) : null}
		</Index>
	)
}

export default IntegrationsTabContents
