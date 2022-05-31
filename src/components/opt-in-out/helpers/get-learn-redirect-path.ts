import { ProductOption } from 'lib/learn-client/types'
import { PLATFORM_OPTIONS } from '.'

export function getLearnRedirectPath(
  currentPath: string,
  product?: ProductOption
) {
  const originalUrl = new URL(currentPath, PLATFORM_OPTIONS['learn'].base_url)
  const finalUrl = new URL(PLATFORM_OPTIONS['learn'].base_url)
  finalUrl.searchParams.set('betaOptOut', 'true')
  finalUrl.searchParams.set('path', originalUrl.pathname)

  if (product) {
    finalUrl.searchParams.set('product', product)
  }

  return finalUrl.toString()
}
