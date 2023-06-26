/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Global
import Tabs, { Tab } from 'components/tabs'
import { CommandBarDivider } from 'components/command-bar/components'
import { CommandBarList } from 'components/command-bar/components'
// Shared search
import {
	NoResultsMessage,
	SuggestedPage,
	SuggestedPages,
	TabHeadingWithCount,
} from '../../../components'
// Unified search
import { UnifiedHit } from '../unified-hit'
// Types
import type { Hit } from 'instantsearch.js'
import type { UnifiedSearchTabContent } from './helpers'
// Styles
import s from './unified-hits-container.module.css'

/**
 * Render search results from our unified index into content-type tabs.
 */
export function UnifiedHitsContainer({
	tabsData,
	suggestedPages,
}: {
	tabsData: UnifiedSearchTabContent[]
	suggestedPages: SuggestedPage[]
}) {
	return (
		<div className={s.tabsWrapper}>
			<Tabs showAnchorLine={false} variant="compact">
				{tabsData.map((tabData: UnifiedSearchTabContent) => {
					const { type, heading, icon, hits, hitCount, otherTabData } = tabData
					const resultsLabelId = `${type}-search-results-label`
					return (
						<Tab
							heading={heading}
							headingSlot={
								<TabHeadingWithCount
									heading={heading}
									count={type === 'global' ? undefined : hitCount}
								/>
							}
							icon={icon}
							key={type}
						>
							{hitCount > 0 ? (
								<>
									<div id={resultsLabelId} className="g-screen-reader-only">
										{type} search results
									</div>
									<div className={s.commandBarListWrapper}>
										<CommandBarList ariaLabelledBy={resultsLabelId}>
											{/* TODO: would be great to have a more detailed type 
											    here for `hit`, but for now, not over-engineering. */}
											{hits.map((hit: Hit) => (
												<UnifiedHit key={hit.objectID} hit={hit} />
											))}
										</CommandBarList>
									</div>
								</>
							) : (
								<>
									<NoResultsMessage
										currentTabHeading={heading}
										tabsWithResults={otherTabData}
									/>
									<CommandBarDivider className={s.divider} />
									<SuggestedPages pages={suggestedPages} />
								</>
							)}
						</Tab>
					)
				})}
			</Tabs>
		</div>
	)
}
