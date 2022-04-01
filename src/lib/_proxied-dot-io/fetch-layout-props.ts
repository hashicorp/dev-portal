import { ComponentType } from 'react'
import { Products } from '@hashicorp/platform-product-meta'

interface RivetParams {
  query: string
  dependencies: ComponentMaybeWithQuery
}

type ComponentMaybeWithQuery = ComponentType & { rivetParams?: RivetParams }

export default async function fetchLayoutProps(
  Layout: ComponentMaybeWithQuery,
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
