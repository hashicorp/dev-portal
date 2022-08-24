import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { INDEX_NAME } from '../constants'

/**
 * Converts query parameters to a structured search state object
 */
export function routerStateToSearchState(routeState) {
	return {
		[INDEX_NAME]: {
			query: routeState.query,
			refinementList: {
				products: routeState?.product?.split?.(',') ?? [],
			},
			menu: {
				edition: routeState.edition,
			},
			toggle: {
				hasVideo: routeState.hasVideo,
				isInteractive: routeState.isInteractive,
			},
		},
	}
}

export function searchStateToRouteState(searchState) {
	const state = searchState[INDEX_NAME]
	const result = {
		query: state.query,
		product: state.refinementList?.products?.join(',') || undefined,
		edition: state?.menu?.edition,
		hasVideo: state?.toggle?.hasVideo,
		isInteractive: state?.toggle?.isInteractive,
	}

	return stripUndefinedProperties(result)
}
