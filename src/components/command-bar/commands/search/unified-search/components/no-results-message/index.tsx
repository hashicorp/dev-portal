/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
// Experiment: support-tab-text START
import { useFeatureFlagVariantKey } from 'posthog-js/react'
// Experiment: support-tab-text END
import Badge from 'components/badge'
import Text from 'components/text'
import { useCommandBar } from 'components/command-bar'
import s from './no-results-message.module.css'
import { SearchContentTypes } from '../../types'

interface NoResultsMessageProps {
	tabsWithResults: {
		type: SearchContentTypes
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
	// Experiment: support-tab-text START
	const featureFlagKey = useFeatureFlagVariantKey(
		'support-tab-text'
	)
	// Experiment: support-tab-text END

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
						// Experiment: support-tab-text START
						const badgeHeading =
							featureFlagKey === 'variant' &&
							otherTab.type === SearchContentTypes.KNOWLEDGEBASE
								? 'Knowledge Base'
								: otherTab.heading
						// Experiment: support-tab-text END
						return (
							<span key={otherTab.type}>
								<Badge
									className={s.otherTabBadge}
									icon={otherTab.icon}
									text={badgeHeading}
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
