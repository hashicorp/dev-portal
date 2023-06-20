// Icons
import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconGlobe16 } from '@hashicorp/flight-icons/svg-react/globe-16'
import { IconLearn16 } from '@hashicorp/flight-icons/svg-react/learn-16'
import { IconPipeline16 } from '@hashicorp/flight-icons/svg-react/pipeline-16'
// Helpers
import { getShouldRenderIntegrationsTab } from './get-should-render-integrations-tab'
// Types
import type { ReactElement } from 'react'
import type { Hit } from 'instantsearch.js'
import type { CurrentContentType } from 'contexts'
import type { ProductSlug } from 'types/products'
import type {
	UnifiedSearchResults,
	UnifiedSearchableContentType,
} from '../../../types'

/**
 * Each content type tab has a set of properties required for rendering.
 */
export interface UnifiedSearchTabContent {
	type: CurrentContentType
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
 * Basic heading and icon content for each tab, which we'll build on.
 */
const tabContentByType: Record<
	UnifiedSearchableContentType,
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
	tutorial: {
		heading: 'Tutorials',
		icon: <IconLearn16 />,
	},
	integration: {
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
	tabsData: Omit<UnifiedSearchTabContent, 'otherTabData'>[],
	currentTabType: CurrentContentType
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
		return t !== 'integrations' || shouldRenderIntegrationsTab
	})
	/**
	 * Map each content type to { heading, hits, icon } etcetera for each tab
	 */
	const tabsData = validContentTypes.map((type: CurrentContentType) => {
		const { heading, icon } = tabContentByType[type]
		const hits = unifiedSearchResults[type].hits
		const hitCount = hits.length
		//
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
