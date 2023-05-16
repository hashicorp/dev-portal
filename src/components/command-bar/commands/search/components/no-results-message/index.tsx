/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Text from 'components/text'
import { useHitsContext } from '../../helpers'
import s from './no-results-message.module.css'
import { useCommandBar } from 'components/command-bar'
import { SearchableContentType } from 'contexts'

function NoResultsMessage({
	activeTabIndex,
	setActiveTabIndex,
	tabData,
}: {
	activeTabIndex: number
	setActiveTabIndex: (index: number) => void
	tabData: $TSFixMe
}) {
	const { currentInputValue } = useCommandBar()
	const [hitCounts] = useHitsContext()
	/**
	 * TODO: write a context & hook like the below, to avoid props threading.
	 * Currently difficult to do this WITHOUT tab threading, or refactoring
	 * a bunch of things, so going with context seems like it might be fine
	 * for now, especially since we may move away from the tabbed interface
	 * in the near future once the "unified" index lands.
	 */
	// const { tabItems, activeTabIndex, setActiveTabIndex } = useTabsData()

	const tabDataWithCounts = Object.keys(tabData).map(
		(contentType: SearchableContentType) => {
			return {
				type: contentType,
				heading: tabData[contentType].heading,
				tabIdx: tabData[contentType].tabIdx,
				hitCount: hitCounts[contentType],
			}
		}
	)

	const currentTabData = tabDataWithCounts.find(
		(tab) => tab.tabIdx === activeTabIndex
	)
	const otherTabsWithResults = tabDataWithCounts.filter((otherTab) => {
		return otherTab.tabIdx !== currentTabData.tabIdx && otherTab.hitCount > 0
	})

	return (
		<div className={s.root}>
			<Text asElement="p" size={300} weight="medium">
				Sorry, no matches for &Prime;{currentInputValue}&Prime; were found
				{otherTabsWithResults.length > 0
					? `within ${currentTabData.heading}.`
					: '.'}
			</Text>
			{otherTabsWithResults.length > 0 ? (
				<Text asElement="p" size={300} weight="medium">
					Check the{' '}
					{otherTabsWithResults.map((otherTab, idx) => {
						const isLastItem = idx === otherTabsWithResults.length - 1
						return (
							<span key={otherTab.type}>
								<button
									style={{ cursor: 'pointer' }}
									onClick={() => setActiveTabIndex(otherTab.tabIdx)}
								>
									{otherTab.heading}
								</button>
								{!isLastItem ? <span>{' or '}</span> : null}
							</span>
						)
					})}{' '}
					section{otherTabsWithResults.length === 1 ? '' : 's'} to see other
					results.
				</Text>
			) : null}
			{/* <pre style={{ textAlign: 'left' }}>
				<code>{JSON.stringify({ otherTabsWithResults }, null, 2)}</code>
			</pre> */}
		</div>
	)
}

export default NoResultsMessage
