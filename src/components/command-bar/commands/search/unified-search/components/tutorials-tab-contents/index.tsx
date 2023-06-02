/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Configure, Index } from 'react-instantsearch-hooks-web'
import { IconGuide16 } from '@hashicorp/flight-icons/svg-react/guide-16'
import { TabContentsCta } from '../../../components'
import { CustomHitsContainer } from '../'
import { TutorialsTabContentsProps } from './types'

const TutorialsTabContents = ({
	currentProductTag,
	tutorialLibraryCta,
	noResultsMessageSlot,
}: TutorialsTabContentsProps) => {
	const filters = []

	if (currentProductTag) {
		const { id } = currentProductTag
		if (id === 'hcp') {
			filters.push('edition:hcp')
		} else {
			filters.push(`products:${id}`)
		}
	}

	filters.push(`type:tutorial`)

	return (
		<Index indexName={__config.dev_dot.algolia.unifiedIndexName}>
			<Configure filters={filters.join(' AND ')} />
			<CustomHitsContainer
				type="tutorials"
				noResultsSlot={noResultsMessageSlot}
			/>
			<TabContentsCta
				href={tutorialLibraryCta.href}
				icon={<IconGuide16 />}
				text={tutorialLibraryCta.text}
			/>
		</Index>
	)
}

export default TutorialsTabContents
