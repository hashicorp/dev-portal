import { useQuery, UseQueryResult } from '@tanstack/react-query'
import {
	fetchAllIntegrations,
	FetchAllIntegrationsResult,
} from 'lib/integrations'
import { ProductSlug } from 'types/products'

type QueryDataType = FetchAllIntegrationsResult

interface UseIntegrationsByProductSlugsOptions {
	enabled?: boolean
	productSlugs: ProductSlug[]
}

interface UseIntegrationsByProductSlugsResult
	extends Omit<UseQueryResult<QueryDataType>, 'data'> {
	integrations: UseQueryResult<QueryDataType>['data']
}

/**
 * Handles fetching and storing integrations with React Query for the given
 * `productSlugs`.
 */
const useIntegrationsByProductSlugs = ({
	enabled = true,
	productSlugs,
}: UseIntegrationsByProductSlugsOptions): UseIntegrationsByProductSlugsResult => {
	const { data: integrations, ...restQueryResult } = useQuery<QueryDataType>(
		['integrations', { productSlugs }],
		() => fetchAllIntegrations(productSlugs),
		{ enabled }
	)
	return { integrations, ...restQueryResult }
}

export type {
	UseIntegrationsByProductSlugsOptions,
	UseIntegrationsByProductSlugsResult,
}
export { useIntegrationsByProductSlugs }
