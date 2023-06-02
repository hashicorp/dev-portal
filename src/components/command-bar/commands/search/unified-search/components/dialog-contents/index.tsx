import { useMemo } from 'react'
import {
	NoResultsMessage,
	RecentSearches,
	SuggestedPages,
	TabHeadingWithCount,
} from '../../../components'
import { useCommandBar } from 'components/command-bar'
import { useHitsContext } from '../../../helpers'
import { tabContentByType } from './tab-content-by-type'
import Tabs, { Tab } from 'components/tabs'
// Types
import type { SearchableContentType } from 'contexts'
// Styles
import s from './dialog-contents.module.css'

/**
 * TODO: add description
 */
const PRODUCT_SLUGS_WITH_INTEGRATIONS =
	__config.dev_dot.product_slugs_with_integrations

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
	let shouldRenderIntegrationsTab
	if (PRODUCT_SLUGS_WITH_INTEGRATIONS.length <= 0) {
		// If no products have integrations, do not render it
		shouldRenderIntegrationsTab = false
	} else if (currentProductTag) {
		// If there is a product tag, render it if the product has integrations
		const productHasIntegrations = PRODUCT_SLUGS_WITH_INTEGRATIONS.includes(
			currentProductTag.id
		)
		shouldRenderIntegrationsTab = productHasIntegrations
	} else {
		// Otherwise search is across all products, so render it
		shouldRenderIntegrationsTab = true
	}

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

					const { heading, icon, renderContent } = tabContentByType[contentType]

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
							{renderContent({
								currentProductTag,
								suggestedPages,
								noResultsMessageSlot: (
									<NoResultsMessage
										currentTabHeading={heading}
										tabsWithResults={tabData.filter((tabData) => {
											const isOtherTab = tabData.type !== contentType
											const tabHasResults = tabData.hitCount > 0
											return isOtherTab && tabHasResults
										})}
									/>
								),
							})}
						</Tab>
					)
				})}
			</Tabs>
		</div>
	)

	// return (
	// 	<div style={{ border: '2px solid magenta', overflow: 'hidden' }}>
	// 		Unified search results pane will go here.
	// 		<pre>
	// 			<code>
	// 				{JSON.stringify(
	// 					{
	// 						currentProductTag,
	// 						recentSearches,
	// 						// Note: icon ends up making a "cyclic reference" error
	// 						suggestedPages: suggestedPages.map(({ icon, ...rest }) => rest),
	// 					},
	// 					null,
	// 					2
	// 				)}
	// 			</code>
	// 		</pre>
	// 	</div>
	// )
}

export { UnifiedSearchDialogContents }
