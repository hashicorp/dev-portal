/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Global
import Tabs, { Tab } from 'components/tabs'
import { CommandBarDivider } from 'components/command-bar/components'
import { CommandBarList } from 'components/command-bar/components'
// Unified search
import TabHeadingWithCount from '../tab-heading-with-count'
import NoResultsMessage from '../no-results-message'
import SuggestedPages from '../suggested-pages'

import { UnifiedHit } from '../unified-hit'
import { getUnifiedHitProps } from '../unified-hit/helpers'
// Types
import type { Hit } from 'instantsearch.js'
import type { UnifiedSearchTabContent } from './helpers'
import type { SuggestedPageProps } from '../suggested-pages/types'
import { SearchContentTypes } from '../../types'
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
	suggestedPages: SuggestedPageProps[]
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
									count={
										type === SearchContentTypes.GLOBAL ? undefined : hitCount
									}
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
											{hits.map((hit: Hit) => (
												<li key={hit.objectID}>
													<UnifiedHit {...getUnifiedHitProps(hit)} />
												</li>
											))}
										</CommandBarList>
										{/* TODO: add suggested pages */}
									</div>
								</>
							) : (
								<div className={s.noResultsWrapper}>
									<NoResultsMessage
										currentTabHeading={heading}
										tabsWithResults={otherTabData}
									/>
									<CommandBarDivider className={s.divider} />
									<SuggestedPages pages={suggestedPages} />
								</div>
							)}
						</Tab>
					)
				})}
			</Tabs>
		</div>
	)
}
