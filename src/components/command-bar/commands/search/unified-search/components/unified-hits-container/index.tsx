// Libraries
import { useMemo } from 'react'
import { useHits } from 'react-instantsearch-hooks-web'
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
import { gatherSearchTabsContent } from './helpers'
// Types
import type { ProductSlug } from 'types/products'
import type { Hit } from 'instantsearch.js'
import type { UnifiedSearchTabContent } from './helpers'
// Styles
import s from './unified-hits-container.module.css'

/**
 * Render search results from our unified index into content-type tabs.
 *
 * Note: this component needs to be used within an `InstantSearch` container
 * imported from 'react-instantsearch-hooks-web'. That container provides
 * the context from which `rawHits` are pulled.
 */
export function UnifiedHitsContainer({
	currentProductSlug,
	suggestedPages,
}: {
	currentProductSlug?: ProductSlug
	suggestedPages: SuggestedPage[]
}) {
	const { hits: rawHits } = useHits()

	/**
	 * Transform searchableContentTypes into data for each content tab.
	 *
	 * Note: we set up this data before rather than during render,
	 * because each tab needs data from all other tabs in order
	 * to show a helpful "No Results" message.
	 */
	const allTabData = useMemo(
		() => gatherSearchTabsContent(rawHits, currentProductSlug),
		[rawHits, currentProductSlug]
	)

	/**
	 * Render the tabs. This is mostly presentation since `tabData` logic is done.
	 */
	return (
		<div className={s.tabsWrapper}>
			<Tabs showAnchorLine={false} variant="compact">
				{allTabData.map((tabData: UnifiedSearchTabContent) => {
					const { type, heading, icon, hits, hitCount, otherTabsWithResults } =
						tabData
					const resultsLabelId = `${type}-search-results-label`

					return (
						<Tab
							heading={heading}
							headingSlot={
								<TabHeadingWithCount heading={heading} count={hitCount} />
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
										tabsWithResults={otherTabsWithResults}
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
