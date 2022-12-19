import { ComponentType } from 'react'
import { Products } from '@hashicorp/platform-product-meta'

interface RivetParams {
	query: string
	dependencies: ComponentMaybeWithQuery
}

export type ComponentMaybeWithQuery = ComponentType & {
	rivetParams?: RivetParams
}

/**
 * Detects rivetParams hanging off of a component and attempts to fetch with the
 * provided query. Used to dynamically fetch CMS data necessary for our Layout components.
 *
 * Example:
 * ```
 * const VaultLayout = () => { ... }
 * VaultLayout.rivetParams = {
 *   query: myGraphQLQuery
 * }
 *
 * const data = await fetchLayoutProps(VaultLayout, 'vault')
 * ```
 *
 * @param Layout Layout component
 * @param product Product for which we are fetching data
 * @returns The data from our CMS, if any
 */
export default async function fetchLayoutProps(
	Layout: ComponentMaybeWithQuery | undefined,
	product: Exclude<Products, 'hashicorp'>
): Promise<unknown | null> {
	const layoutQuery = Layout?.rivetParams ?? null

	const { default: rivetQuery, proxiedRivetClient } = await import('lib/cms')
	let query = rivetQuery
	if (product) {
		query = proxiedRivetClient(product)
	}

	const layoutProps = layoutQuery ? await query(layoutQuery) : null

	return layoutProps
}
