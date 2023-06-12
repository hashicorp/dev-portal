import { useMemo } from 'react'
import {
	NoResultsMessage,
	RecentSearches,
	SuggestedPages,
	TabContentsCta,
	TabHeadingWithCount,
} from '../../../components'
import { useCommandBar } from 'components/command-bar'
import { generateTutorialLibraryCta } from '../../../helpers'
import { tabContentByType } from './tab-content-by-type'
import Tabs, { Tab } from 'components/tabs'
// Types
import type { SearchableContentType } from 'contexts'
// Styles
import s from './dialog-contents.module.css'
import { IconGuide16 } from '@hashicorp/flight-icons/svg-react/guide-16'
import { IconPipeline16 } from '@hashicorp/flight-icons/svg-react/pipeline-16'
import { Configure, Index, useHits } from 'react-instantsearch-hooks-web'
import { CommandBarDivider } from 'components/command-bar/components'
import { CommandBarList } from 'components/command-bar/components'
import { UnifiedHit } from '../unified-hit'
import { getShouldRenderIntegrationsTab } from './get-should-render-integrations-tab'
import { getAlgoliaContentType } from './get-algolia-content-type'
import { filterUnifiedSearchHits } from './filter-unified-search-hits'
import { buildAlgoliaFilters } from './build-algolia-filters'

function UnifiedHitsContainer({ currentProductTag, suggestedPages }) {
	const { hits: rawHits } = useHits()

	/**
	 * Transform searchableContentTypes into data for each content tab.
	 *
	 * Note: we set up this data before rather than during render,
	 * because each tab potentially needs any other tab's data in order
	 * to render a helpful "No Results" message.
	 */
	const tabData = useMemo(() => {
		const searchableContentTypes = Object.keys(tabContentByType)
		return searchableContentTypes.map((contentType: SearchableContentType) => {
			const { heading, icon } = tabContentByType[contentType]
			// TODO: refactor use of algoliaContentType,
			// maybe the SearchableContentType type should be updated?
			const algoliaContentType = getAlgoliaContentType(contentType)
			const hits = filterUnifiedSearchHits(rawHits, {
				contentType: ['docs', 'tutorial', 'integration'].includes(
					algoliaContentType
				)
					? algoliaContentType
					: undefined,
			})
			return {
				type: contentType,
				heading,
				icon,
				hits,
				hitCount: hits.length,
				algoliaContentType,
			}
		})
	}, [rawHits])

	/**
	 * Determine whether the Integrations tab should be rendered.
	 *
	 * TODO: could useMemo here, will re-render a lot without currentProductTag
	 * changing, so even though it's minor, might be worth it.
	 */
	const shouldRenderIntegrationsTab =
		getShouldRenderIntegrationsTab(currentProductTag)

	return (
		<div className={s.tabsWrapper}>
			<Tabs showAnchorLine={false} variant="compact">
				{tabData.map((thisTabData: $TSFixMe) => {
					const { type, heading, icon, hits, algoliaContentType } = thisTabData
					if (type === 'integrations' && !shouldRenderIntegrationsTab) {
						return null
					}

					const tutorialLibraryCta =
						generateTutorialLibraryCta(currentProductTag)

					const hitCount = hits && hits.length
					const hasNoResults = hitCount <= 0
					const commandBarListElementId = `${algoliaContentType}-search-results-label`

					return (
						<Tab
							heading={heading}
							headingSlot={
								<TabHeadingWithCount heading={heading} count={hitCount} />
							}
							icon={icon}
							key={type}
						>
							{hasNoResults ? (
								<>
									<NoResultsMessage
										currentTabHeading={heading}
										tabsWithResults={tabData.filter((tabData) => {
											const isOtherTab = tabData.type !== type
											const tabHasResults = tabData.hitCount > 0
											return isOtherTab && tabHasResults
										})}
									/>
									<CommandBarDivider className={s.divider} />
									<SuggestedPages pages={suggestedPages} />
								</>
							) : (
								<>
									<div
										id={commandBarListElementId}
										className="g-screen-reader-only"
									>
										{type} search results
									</div>
									<div className={s.commandBarListWrapper}>
										<CommandBarList ariaLabelledBy={commandBarListElementId}>
											{hits.map((hit: $TSFixMe) => {
												return <UnifiedHit key={hit.objectID} hit={hit} />
											})}
										</CommandBarList>
									</div>
								</>
							)}
							{/* THOUGHT: maybe drop these CTAs, the "suggested pages" already
							    cover all of the same content? Also, maybe "suggested pages"
									should be more of a flex layout? Very TALL right now. */}
							{/* Show the tutorials library CTA in the Tutorials tab */}
							{type === 'tutorials' ? (
								<TabContentsCta
									href={tutorialLibraryCta.href}
									icon={<IconGuide16 />}
									text={tutorialLibraryCta.text}
								/>
							) : null}
							{/* Show a product-specific integrations CTA where applicable */}
							{type === 'integrations' && currentProductTag ? (
								<TabContentsCta
									href={`/${currentProductTag.id}/integrations`}
									icon={<IconPipeline16 />}
									text={`See all ${currentProductTag.text} integrations`}
								/>
							) : null}
						</Tab>
					)
				})}
			</Tabs>
		</div>
	)
}
/**
 * TODO: should rethink this pretty heavily.
 *
 * Rather than having multiple index `Configure` blocks, maybe have a single
 * component, like the `all-tab-contents`, and apply a filter by `type` on
 * the front-end. This will ensure counts match up properly.
 *
 * When doing this, should consider bumping up `hitsPerPage` from the default
 * `20`. Reasoning: the single "page" will be filtered down for each content
 * type, we want to make sure we have a good mix of types, even if one
 * content type has stronger relevance than another.
 *
 * As well, with the above refactor in place, `useHitsContext`
 * should no longer be necessary.
 */
function UnifiedSearchDialogContents({
	currentProductTag,
	recentSearches,
	suggestedPages,
}: {
	currentProductTag: $TSFixMe
	recentSearches: $TSFixMe
	suggestedPages: $TSFixMe
}) {
	const { currentInputValue } = useCommandBar()

	/**
	 * Don't render search result Tabs at all if there is no text in the input.
	 */
	if (!currentInputValue) {
		return (
			<div className={s.suggestedPagesWrapper}>
				<RecentSearches recentSearches={recentSearches} />
				<SuggestedPages pages={suggestedPages} />
			</div>
		)
	}

	const filters = buildAlgoliaFilters(currentProductTag)

	return (
		<Index indexName={__config.dev_dot.algolia.unifiedIndexName}>
			<Configure filters={filters} />
			<UnifiedHitsContainer
				currentProductTag={currentProductTag}
				suggestedPages={suggestedPages}
			/>
		</Index>
	)
}

export { UnifiedSearchDialogContents }
