/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Content (icons and tab names by type)
import { tabContentByType } from '../../../content'
// Helpers
import { getShouldRenderIntegrationsTab } from './get-should-render-integrations-tab'
// Types
import type { ReactElement } from 'react'
import type { Hit } from 'instantsearch.js'
import type { ProductSlug } from 'types/products'
import { SearchContentTypes, type UnifiedSearchResults } from '../../../types'

/**
 * Pull which products have integrations off of our global config.
 */
const PRODUCT_SLUGS_WITH_INTEGRATIONS =
	__config.dev_dot.product_slugs_with_integrations

/**
 * Each content type tab has a set of properties required for rendering.
 */
export interface UnifiedSearchTabContent {
	type: SearchContentTypes
	heading: string
	hitCount: number
	hits: Hit[]
	icon: ReactElement<React.JSX.IntrinsicElements['svg']>
	otherTabData: OtherTabData
}

/**
 * Each content type tab needs information about all other content type tabs
 * in order to provide helpful "no results" messages.
 */
type OtherTabData = Pick<UnifiedSearchTabContent, 'type' | 'heading' | 'icon'>[]
/**
 * Given all the tab data collected so far, and a specific content type,
 * Return an array of basic data for tabs other than the specified content
 * type that have more than 0 results.
 *
 * Used to render helpful "no results" messages for each tab.
 */
function getOtherTabsWithResults(
	tabsData: Omit<UnifiedSearchTabContent, 'otherTabData'>[],
	currentTabType: SearchContentTypes
): OtherTabData {
	return tabsData
		.filter((tabData) => {
			const isOtherTab = tabData.type !== currentTabType
			const tabHasResults = tabData.hitCount > 0
			return isOtherTab && tabHasResults
		})
		.map((otherTabData) => {
			return {
				heading: otherTabData.heading,
				icon: otherTabData.icon,
				type: otherTabData.type,
			}
		})
}

/**
 * Transform unified search results into tab data that the
 * `UnifiedHitsContainer` component can render.
 */
export function gatherSearchTabsData(
	unifiedSearchResults: UnifiedSearchResults,
	currentProductSlug?: ProductSlug
): UnifiedSearchTabContent[] {
	const searchableContentTypes = Object.keys(tabContentByType)
	/**
	 * Omit the integrations tab where applicable using a filter
	 */
	const shouldRenderIntegrationsTab =
		getShouldRenderIntegrationsTab(currentProductSlug)
	const validContentTypes = searchableContentTypes.filter((t) => {
		return t !== SearchContentTypes.INTEGRATION || shouldRenderIntegrationsTab
	})
	/**
	 * Map each content type to { heading, hits, icon } etcetera for each tab
	 */
	const tabsData = validContentTypes.map((type: SearchContentTypes) => {
		const { heading, icon } = tabContentByType[type]
		const rawHits = unifiedSearchResults[type].hits

		// If type is global, also add knowledgebase hits since they are not included in the global hits
		// in the <InstantSearch> component because the knowledgebase hits come from a different index.
		// Also, don't add knowledgebase hits if there are already 20 or more hits for global.
		if (type === SearchContentTypes.GLOBAL && rawHits.length < 20) {
			const knowledgebaseHits = unifiedSearchResults.knowledgebase.hits.slice(
				0,
				20 - rawHits.length
			)
			rawHits.push(...knowledgebaseHits)
		}

		/**
		 * If the resultType is `global`, we want to include all results...
		 * **Except** we need to filter out `integrations` for products that don't
		 * yet have their integrations global config flags set to `true`.
		 *
		 * Ideally we would do this with an Algolia filter, but this doesn't seem
		 * possible, as Algolia is extremely limiting in what filters they allow.
		 * Specifically, they strictly allow only "conjunctions of disjunctions",
		 * or in other words "(X OR Y) AND (A OR B)", so filters such as
		 * `(type:docs OR type:tutorial) OR (type:integration AND products:waypoint)`
		 * do not seem to be possible.
		 * Ref: https://www.algolia.com/doc/api-reference/api-parameters/filters/
		 * Playground: https://www.algolia.com/doc/api-reference/api-parameters/filters/#filters-syntax-validator
		 *
		 * The caveat with this approach is that we'll see a more limited list
		 * of results when searching for terms that return `integrations` results
		 * from inactive products. One way to mitigate this would be to add
		 * filtering logic at indexing time, however, we'd then need to replicate
		 * our integration flags from this repository to the integrations repo.
		 *
		 * The ideal solution would be if Algolia supported slightly more
		 * complex filtering logic.
		 */
		const hits = rawHits.filter((hit: Hit) => {
			// If this hit is not an integration, definitely include it
			if (hit.type !== SearchContentTypes.INTEGRATION) {
				return true
			}
			// For integration hits, only include it for active products
			// Note that we expect integrations to have exactly one product.
			const hitProductSlug = hit.products[0]
			return PRODUCT_SLUGS_WITH_INTEGRATIONS.includes(hitProductSlug)
		})
		const hitCount = hits.length

		return { type, heading, hits, hitCount, icon }
	})
	/**
	 * Add "other" tab data to each search tab. Used for "no results" messages.
	 */
	return tabsData.map((currentTab) => {
		const otherTabData = getOtherTabsWithResults(tabsData, currentTab.type)
		return { ...currentTab, otherTabData }
	})
}
