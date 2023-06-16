// Icons
import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconGlobe16 } from '@hashicorp/flight-icons/svg-react/globe-16'
import { IconLearn16 } from '@hashicorp/flight-icons/svg-react/learn-16'
import { IconPipeline16 } from '@hashicorp/flight-icons/svg-react/pipeline-16'
// Helpers
import { getShouldRenderIntegrationsTab } from './get-should-render-integrations-tab'
import { filterUnifiedSearchHits } from './filter-unified-search-hits'
// Types
import type { ReactElement } from 'react'
import type { Hit } from 'instantsearch.js'
import type { CurrentContentType } from 'contexts'
import { ProductSlug } from 'types/products'

/**
 * Each content type tab has a set of properties required for rendering.
 */
export interface UnifiedSearchTabContent {
	type: CurrentContentType
	heading: string
	hitCount: number
	hits: Hit[]
	icon: ReactElement<React.JSX.IntrinsicElements['svg']>
	otherTabsWithResults: OtherTabData
}

/**
 * Each content type tab needs information about all other content type tabs
 * in order to provide helpful "no results" messages.
 */
type OtherTabData = Pick<UnifiedSearchTabContent, 'type' | 'heading' | 'icon'>[]

/**
 * Basic heading and icon content for each tab, which we'll build on.
 */
const tabContentByType: Record<
	CurrentContentType,
	Pick<UnifiedSearchTabContent, 'heading' | 'icon'>
> = {
	global: {
		heading: 'All',
		icon: <IconGlobe16 />,
	},
	docs: {
		heading: 'Documentation',
		icon: <IconDocs16 />,
	},
	tutorials: {
		heading: 'Tutorials',
		icon: <IconLearn16 />,
	},
	integrations: {
		heading: 'Integrations',
		icon: <IconPipeline16 />,
	},
}

/**
 * Given all the tab data collected so far, and a specific content type,
 * Return an array of basic data for tabs other than the specified content
 * type that have more than 0 results.
 *
 * Used to render helpful "no results" messages for each tab.
 */
function getOtherTabsWithResults(
	allTabData: Omit<UnifiedSearchTabContent, 'otherTabsWithResults'>[],
	currentTabType: CurrentContentType
): OtherTabData {
	return allTabData
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

export function gatherSearchTabsContent(
	rawHits: Hit[],
	currentProductSlug?: ProductSlug
): UnifiedSearchTabContent[] {
	const searchableContentTypes = Object.keys(tabContentByType)
	/**
	 * Omit the integrations tab where applicable using a filter
	 */
	const shouldRenderIntegrationsTab =
		getShouldRenderIntegrationsTab(currentProductSlug)
	const validContentTypes = searchableContentTypes.filter((t) => {
		return t !== 'integrations' || shouldRenderIntegrationsTab
	})
	/**
	 * Map each content type to { heading, hits, icon } etcetera for each tab
	 */
	const allTabData = validContentTypes.map((type: CurrentContentType) => {
		const { heading, icon } = tabContentByType[type]
		const hits = filterUnifiedSearchHits(rawHits, type)
		const hitCount = hits.length
		//
		return { type, heading, hits, hitCount, icon }
	})
	/**
	 * Add "other" tab data to each search tab. Used for "no results" messages.
	 */
	return allTabData.map((currentTab) => {
		const otherTabsWithResults = getOtherTabsWithResults(
			allTabData,
			currentTab.type
		)
		return { ...currentTab, otherTabsWithResults }
	})
}
