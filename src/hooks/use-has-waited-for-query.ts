import { QueryKey, useQueryClient } from '@tanstack/react-query'

/**
 * Hook to return whether we've attempted a particular query yet.
 *
 * This is intended for use in individual progress queries,
 * in order to check whether a relevant batch query has been attempted.
 *
 * Why? We want to give the batch query a chance to prime the cache
 * before firing off individual queries. So, we likely want to disable
 * individual queries until a batch query has been attempted at least once.
 */
export function useHasWaitedForQuery(queryKey: QueryKey): boolean {
	/**
	 * The our batch query state from the queryClient
	 */
	const queryClient = useQueryClient()
	const queryStatue = queryClient.getQueryState(queryKey, {
		exact: false,
	})
	/**
	 * We've made an attempt if:
	 * - some matching query exists (queryStatue is NOT undefined)
	 * - that matching query has updated or failed at least once
	 */
	let hasTargetQueryAttempt = false
	const hasBatchQuery = typeof queryStatue !== 'undefined'
	if (hasBatchQuery) {
		const { dataUpdateCount, fetchFailureCount } = queryStatue
		hasTargetQueryAttempt = dataUpdateCount > 0 || fetchFailureCount > 0
	}
	return hasTargetQueryAttempt
}
