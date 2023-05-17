/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Text from 'components/text'
import { useHitsContext } from '../../helpers'
import { SearchableContentType } from 'contexts'
import { useCommandBar } from 'components/command-bar'
import s from './no-results-message.module.css'
import Badge from 'components/badge'

export interface NoResultsMessageProps {
	tabData: $TSFixMe
	currentTabIndex: $TSFixMe
}

const NoResultsMessage = ({
	tabData,
	currentTabIndex,
}: NoResultsMessageProps) => {
	const { currentInputValue } = useCommandBar()
	const [hitCounts] = useHitsContext()

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
		(tab) => tab.tabIdx === currentTabIndex
	)
	const otherTabsWithResults = tabDataWithCounts.filter((otherTab) => {
		return otherTab.tabIdx !== currentTabData.tabIdx && otherTab.hitCount > 0
	})

	return (
		<div className={s.root}>
			<Text asElement="p" size={300} weight="medium">
				Sorry, no matches for &Prime;{currentInputValue}&Prime; were found
				{otherTabsWithResults.length > 0
					? ` within ${currentTabData.heading}.`
					: '.'}
			</Text>
			{otherTabsWithResults.length > 0 ? (
				<Text asElement="p" size={300}>
					Check the{' '}
					{otherTabsWithResults.map((otherTab, idx) => {
						const isLastItem = idx === otherTabsWithResults.length - 1
						return (
							<span key={otherTab.type}>
								<span className={s.otherTabText}>{otherTab.heading}</span>
								{!isLastItem ? <span>{' or '}</span> : null}
							</span>
						)
					})}{' '}
					section{otherTabsWithResults.length === 1 ? '' : 's'} to see other
					results.
				</Text>
			) : null}
			{/* <pre style={{ textAlign: 'left' }}>
			<code>{JSON.stringify({ handleKeyUp }, null, 2)}</code>
		</pre> */}
		</div>
	)
}

export default NoResultsMessage
