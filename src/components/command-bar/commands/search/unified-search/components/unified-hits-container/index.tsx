/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Global
import Tabs, { Tab } from 'components/tabs'
import { CommandBarDivider } from 'components/command-bar/components'
import { CommandBarList } from 'components/command-bar/components'
// Experiment: support-tab-text START
import { useFeatureFlagVariantKey } from 'posthog-js/react'
import posthog from 'posthog-js'
// Experiment: support-tab-text END
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
	// Experiment: support-tab-text START
	const featureFlagKey = useFeatureFlagVariantKey(
		'support-tab-text'
	)

	const handleChange = (newActiveIndex: number) => {
		// The index of the "Support" tab is 4, so we want to send an event to posthog
		// when the users clicks this tab
		if(newActiveIndex === 4) {
			// Send event to posthog
			posthog.capture('experiment_activated', {
				id: 'support-tab-text',
				flagKey: featureFlagKey,
			})
		}
	}
	// Experiment: support-tab-text END

	return (
		<div className={s.tabsWrapper}>
			<Tabs showAnchorLine={false} variant="compact" onChange={handleChange}>
				{tabsData.map((tabData: UnifiedSearchTabContent) => {
					const { type, heading, icon, hits, hitCount, otherTabData } = tabData
					const resultsLabelId = `${type}-search-results-label`

					// Experiment: support-tab-text START
					const tabHeading =
						featureFlagKey === 'variant' &&
						type === SearchContentTypes.KNOWLEDGEBASE
							? 'Knowledge Base'
							: heading
					// Experiment: support-tab-text END
					return (
						<Tab
							heading={tabHeading}
							headingSlot={
								<TabHeadingWithCount
									heading={tabHeading}
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
										currentTabHeading={tabHeading}
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
