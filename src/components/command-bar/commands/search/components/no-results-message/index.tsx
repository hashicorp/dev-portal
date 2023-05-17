/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Text from 'components/text'
import { useCommandBar } from 'components/command-bar'
import s from './no-results-message.module.css'

export interface NoResultsMessageProps {
	tabsWithResults: $TSFixMe[]
	currentTabHeading: string
}

const NoResultsMessage = ({
	tabsWithResults,
	currentTabHeading,
}: NoResultsMessageProps) => {
	const { currentInputValue } = useCommandBar()

	return (
		<div className={s.root}>
			<Text asElement="p" size={300} weight="medium">
				Sorry, no matches for &Prime;{currentInputValue}&Prime; were found
				{tabsWithResults.length > 0 ? ` within ${currentTabHeading}.` : '.'}
			</Text>
			{tabsWithResults.length > 0 ? (
				<Text asElement="p" size={300}>
					Check the{' '}
					{tabsWithResults.map((otherTab, idx) => {
						const isLastItem = idx === tabsWithResults.length - 1
						return (
							<span key={otherTab.type}>
								<span className={s.otherTab}>
									<span className={s.otherTabIcon}>{otherTab.icon}</span>
									{otherTab.heading}
								</span>
								{!isLastItem ? <span>{' or '}</span> : null}
							</span>
						)
					})}{' '}
					section{tabsWithResults.length === 1 ? '' : 's'} to see other results.
				</Text>
			) : null}
			{/* <pre style={{ textAlign: 'left' }}>
			<code>{JSON.stringify({ handleKeyUp }, null, 2)}</code>
		</pre> */}
		</div>
	)
}

export default NoResultsMessage
