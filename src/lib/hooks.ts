import { useRouter } from 'next/router'

/**
 * A Hook that returns the current path with "proxied-dot-io" removed (which is
 * returned on the server) and the product slug.
 *
 * In some instances (particularly during server-side-rendering), Next's
 * useRouter hook will include our "proxied-dot-io" path in the pathname due to
 * how we're using rewrites. This Hook removes that portion of the path,
 * returning just the portion of the path that's rendered in the browser's
 * address bar.
 *
 * Furthermore, it returns the product slug for the given page, which can be
 * used to determine which product we're currently rendering.
 */
export function useProxiedPath(): {
  asPath: string
  proxiedProduct: string | null
} {
  const router = useRouter()

  const pattern = /\/\_proxied-dot-io\/(?<product>[a-z]*)(?:\/(?<path>.*))?/

  let asPath = router.asPath
  const asPathMatches = pattern.exec(router.asPath)
  if (asPathMatches?.groups?.path) {
    // We add a `/` character here since our RegEx group doesn't capture
    // leading slashes
    asPath = `/${asPathMatches.groups.path}`
  } else if (asPathMatches !== null) {
    // If exec returns a match that doesn't have a value for the named capture
    // group `path`, we're on the index route.
    asPath = '/'
  }

  let proxiedProduct: string | null = null
  const pathnameMatches = pattern.exec(router.pathname)
  if (pathnameMatches?.groups?.product) {
    proxiedProduct = pathnameMatches.groups.product
  }

  return { asPath, proxiedProduct }
}
