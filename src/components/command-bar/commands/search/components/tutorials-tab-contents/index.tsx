/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Configure, Index } from 'react-instantsearch-hooks-web'
import { IconGuide16 } from '@hashicorp/flight-icons/svg-react/guide-16'
import { CustomHitsContainer, NoResultsMessage, TabContentsCta } from '../'
import { TutorialsTabContentsProps } from './types'

const TutorialsTabContents = ({
	currentProductTag,
	tutorialLibraryCta,
	setActiveTabIndex,
	tabData,
	activeTabIndex,
}: TutorialsTabContentsProps) => {
	let filters
	if (currentProductTag) {
		const { id } = currentProductTag
		if (id === 'hcp') {
			filters = 'edition:hcp'
		} else {
			filters = `products:${id}`
		}
	}

	return (
		<Index indexName={__config.dev_dot.algolia.tutorialsIndexName}>
			<Configure filters={filters} />
			<CustomHitsContainer
				type="tutorials"
				noResultsSlot={
					<NoResultsMessage
						activeTabIndex={activeTabIndex}
						setActiveTabIndex={setActiveTabIndex}
						tabData={tabData}
					/>
				}
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
