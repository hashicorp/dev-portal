/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import Badge from 'components/badge'
import Text from 'components/text'
import { useCommandBar } from 'components/command-bar'
import s from './no-results-message.module.css'

interface NoResultsMessageProps {
	tabsWithResults: {
		type: 'global' | 'docs' | 'tutorials' | 'integrations'
		heading: string
		icon: ReactElement<React.JSX.IntrinsicElements['svg']>
	}[]
	currentTabHeading: string
}

/**
 * Renders a "no results" message, that optionally directs visitors
 * to other content-type tabs with results, if such results are present.
 */
function NoResultsMessage({
	tabsWithResults,
	currentTabHeading,
}: NoResultsMessageProps) {
	const { currentInputValue } = useCommandBar()

	return (
		<div className={s.root}>
			<Text asElement="p" size={300} weight="medium">
				No matches for &Prime;{currentInputValue}&Prime; were found
				{tabsWithResults.length > 0 ? ` within ${currentTabHeading}.` : '.'}
			</Text>
			{tabsWithResults.length > 0 ? (
				<Text className={s.checkOtherTabs} asElement="p" size={200}>
					Check the{' '}
					{tabsWithResults.map((otherTab, idx) => {
						const isLastItem = idx === tabsWithResults.length - 1
						return (
							<span key={otherTab.type}>
								<Badge
									className={s.otherTabBadge}
									icon={otherTab.icon}
									text={otherTab.heading}
									type="outlined"
									size="small"
								/>
								{!isLastItem ? <span>{' or '}</span> : null}
							</span>
						)
					})}{' '}
					section{tabsWithResults.length === 1 ? '' : 's'} to see additional
					results.
				</Text>
			) : null}
		</div>
	)
}

export default NoResultsMessage
