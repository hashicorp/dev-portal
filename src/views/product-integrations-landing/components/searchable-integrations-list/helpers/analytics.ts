/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { safeAnalyticsTrack } from 'lib/analytics'

/**
 * Track "Integration Library Searched" events.
 *
 * @see /analytics/spec/events/integration_library_searched.yml
 */
function integrationLibrarySearchedEvent({
	search_query,
	results_count,
}: {
	search_query: string
	results_count: number
}) {
	safeAnalyticsTrack('Integration Library Filtered Selected', {
		search_query,
		results_count,
	})
}

/**
 * Track "Integration Library Filtered Selected" events.
 *
 * @see /analytics/spec/events/integration_library_filter_selected.yml
 */
function integrationLibraryFilterSelectedEvent({
	filter_category,
	filter_value,
}: {
	filter_category: 'tier' | 'component' | 'flag' | 'type'
	filter_value: string
}) {
	safeAnalyticsTrack('Integration Library Filtered Selected', {
		filter_category,
		filter_value,
	})
}

export {
	integrationLibrarySearchedEvent,
	integrationLibraryFilterSelectedEvent,
}
