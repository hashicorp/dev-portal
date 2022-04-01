import { ComponentType } from 'react'
import { NextPageContext } from 'next'

interface RivetParams {
  query: string
  dependencies: ComponentMaybeWithQuery
}

type ComponentMaybeWithQuery = ComponentType & { rivetParams?: RivetParams }

export default async function fetchLayoutProps(
  Layout: ComponentMaybeWithQuery,
  ctx: NextPageContext
): Promise<unknown | null> {
  const layoutQuery = Layout?.rivetParams ?? null

  const { default: rivetQuery, proxiedRivetClient } = await import('lib/cms')
  let query = rivetQuery
  if (ctx.pathname.includes('_proxied-dot-io/vault')) {
    query = proxiedRivetClient('vault')
  } else if (ctx.pathname.includes('_proxied-dot-io/consul')) {
    query = proxiedRivetClient('consul')
  }

  const layoutProps = layoutQuery ? await query(layoutQuery) : null

  return layoutProps
}
