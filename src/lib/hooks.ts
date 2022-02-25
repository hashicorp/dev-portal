import { useRouter } from 'next/router'

export function useProxiedPath(): {
  asPath: string
  proxiedProduct: string | null
} {
  const router = useRouter()

  const pattern = /\/\_proxied-dot-io\/(?<product>[a-z]*)\/(?<path>.*)/

  let asPath = router.asPath
  const asPathMatches = pattern.exec(router.asPath)
  if (asPathMatches?.groups?.path) {
    asPath = asPathMatches.groups.path
  }

  let proxiedProduct: string | null = null
  const pathnameMatches = pattern.exec(router.pathname)
  if (pathnameMatches?.groups?.product) {
    proxiedProduct = pathnameMatches.groups.product
  }

  return { asPath, proxiedProduct }
}
