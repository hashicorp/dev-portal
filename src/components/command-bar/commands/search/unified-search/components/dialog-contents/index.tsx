import { useMemo } from 'react'
import {
	NoResultsMessage,
	RecentSearches,
	SuggestedPages,
	TabContentsCta,
	TabHeadingWithCount,
} from '../../../components'
import { useCommandBar } from 'components/command-bar'
import { generateTutorialLibraryCta, useHitsContext } from '../../../helpers'
import { tabContentByType } from './tab-content-by-type'
import Tabs, { Tab } from 'components/tabs'
// Types
import type { SearchableContentType } from 'contexts'
// Styles
import s from './dialog-contents.module.css'
import { IconGuide16 } from '@hashicorp/flight-icons/svg-react/guide-16'
import { IconPipeline16 } from '@hashicorp/flight-icons/svg-react/pipeline-16'
import { Configure, Index } from 'react-instantsearch-hooks-web'
import { CommandBarDivider } from 'components/command-bar/components'
import { CustomHitsContainer } from '../'
import { buildAlgoliaFilters } from './build-algolia-filters'
import { getShouldRenderIntegrationsTab } from './get-should-render-integrations-tab'

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
	const [hitCounts] = useHitsContext()

	/**
	 * TODO: add description
	 */
	const searchableContentTypes = Object.keys(
		tabContentByType
	) as SearchableContentType[]

	/**
	 * TODO: add description
	 */
	const activeTabIndex = 0

	/**
	 * Transform searchableContentTypes into content tab data with hit counts.
	 * We use this to render helpful information in our "no results" message.
	 */
	const tabData = useMemo(() => {
		return searchableContentTypes.map((type) => {
			const { heading, icon } = tabContentByType[type]
			const hitCount = hitCounts[type]
			return { type, heading, icon, hitCount }
		})
	}, [searchableContentTypes, hitCounts])

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

	/**
	 * Determine whether the Integrations tab should be rendered.
	 */
	const shouldRenderIntegrationsTab =
		getShouldRenderIntegrationsTab(currentProductTag)

	return (
		<div className={s.tabsWrapper}>
			<Tabs
				showAnchorLine={false}
				initialActiveIndex={activeTabIndex}
				variant="compact"
			>
				{searchableContentTypes.map((contentType: SearchableContentType) => {
					if (contentType === 'integrations' && !shouldRenderIntegrationsTab) {
						return null
					}

					const { heading, icon } = tabContentByType[contentType]

					/**
					 * Build filters for Algolia
					 */
					const filters = buildAlgoliaFilters(currentProductTag, contentType)

					const tutorialLibraryCta =
						generateTutorialLibraryCta(currentProductTag)

					return (
						<Tab
							heading={heading}
							headingSlot={
								<TabHeadingWithCount
									heading={heading}
									count={hitCounts[contentType]}
								/>
							}
							icon={icon}
							key={contentType}
						>
							<Index indexName={__config.dev_dot.algolia.unifiedIndexName}>
								<Configure filters={filters.join(' AND ')} />
								<CustomHitsContainer
									type={contentType}
									noResultsSlot={
										<>
											<NoResultsMessage
												currentTabHeading={heading}
												tabsWithResults={tabData.filter((tabData) => {
													const isOtherTab = tabData.type !== contentType
													const tabHasResults = tabData.hitCount > 0
													return isOtherTab && tabHasResults
												})}
											/>
											<CommandBarDivider className={s.divider} />
											<SuggestedPages pages={suggestedPages} />
										</>
									}
								/>
							</Index>
							{contentType === 'tutorials' ? (
								<TabContentsCta
									href={tutorialLibraryCta.href}
									icon={<IconGuide16 />}
									text={tutorialLibraryCta.text}
								/>
							) : null}
							{contentType === 'integrations' && currentProductTag ? (
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

export { UnifiedSearchDialogContents }
