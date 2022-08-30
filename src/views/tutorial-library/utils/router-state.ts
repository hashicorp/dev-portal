import { ParsedUrlQuery } from 'querystring'
import { InstantSearchProps } from 'react-instantsearch-hooks-web'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { INDEX_NAME } from '../constants'

/**
 * Converts query parameters to a structured search state object
 */
export function routerStateToSearchState(
	routeState: ParsedUrlQuery
): InstantSearchProps['initialUiState'] {
	return {
		[INDEX_NAME]: {
			page: Number.parseInt(routeState.page as string, 10),
			query: routeState.query as string,
			refinementList: {
				products: (routeState?.product as string)?.split?.(',') ?? [],
			},
			menu: {
				edition: routeState.edition as string,
			},
			toggle: {
				hasVideo:
					typeof routeState.hasVideo !== 'undefined'
						? routeState.hasVideo === 'true'
						: undefined,
				isInteractive:
					typeof routeState.hasInteractive !== 'undefined'
						? routeState.isInteractive === 'true'
						: undefined,
			},
		},
	}
}

/**
 * Converts structured search state into a object to be set as query parameters
 */
export function searchStateToRouteState(
	searchState: InstantSearchProps['initialUiState']
) {
	const state = searchState[INDEX_NAME]
	const result = {
		page: state.page || undefined,
		query: state.query,
		product: state.refinementList?.products?.join(',') || undefined,
		edition: state?.menu?.edition,
		hasVideo: state?.toggle?.hasVideo,
		isInteractive: state?.toggle?.isInteractive,
	}

	return stripUndefinedProperties(result)
}
