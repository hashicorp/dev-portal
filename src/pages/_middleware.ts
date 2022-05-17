import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import redirects from 'data/_redirects.generated.json'

export type OptInPlatformOption = 'vault-io' | 'waypoint-io' | 'learn'
const OPT_IN_MAX_AGE = 60 * 60 * 24 * 180 // 180 days

const HOSTNAME_MAP = {
  'www.boundaryproject.io': 'boundary',
  'test-bd.hashi-mktg.com': 'boundary',

  'www.consul.io': 'consul',
  'test-cs.hashi-mktg.com': 'consul',

  'www.nomadproject.io': 'nomad',
  'test-nm.hashi-mktg.com': 'nomad',

  'www.packer.io': 'packer',
  'test-pk.hashi-mktg.com': 'packer',

  'docs.hashicorp.com': 'sentinel',
  'test-st.hashi-mktg.com': 'sentinel',

  'www.vagrantup.com': 'vagrant',
  'test-vg.hashi-mktg.com': 'vagrant',

  'www.vaultproject.io': 'vault',
  'test-vt.hashi-mktg.com': 'vault',

  'www.waypointproject.io': 'waypoint',
  'test-wp.hashi-mktg.com': 'waypoint',
}

function determineProductSlug(req: NextRequest): string {
  // .io preview on dev portal
  if (req.cookies.io_preview) {
    return req.cookies.io_preview
  }

  // .io production deploy
  if (req.nextUrl.hostname in HOSTNAME_MAP) {
    return HOSTNAME_MAP[req.nextUrl.hostname]
  }

  // dev portal / deploy preview and local preview of io sites
  return '*'
}

/**
 * Root-level middleware that will process all middleware-capable requests.
 * Currently used to support:
 * - Handling simple one-to-one redirects for .io routes
 * - Handling the opt in for cookie setting
 */
export function middleware(req: NextRequest, ev: NextFetchEvent) {
  // Handle redirects
  const product = determineProductSlug(req)
  if (process.env.DEBUG_REDIRECTS) {
    console.log(`[DEBUG_REDIRECTS] determined product to be: ${product}`)
  }
  if (redirects[product] && req.nextUrl.pathname in redirects[product]) {
    const { destination, permanent } = redirects[product][req.nextUrl.pathname]
    if (process.env.DEBUG_REDIRECTS) {
      console.log(
        `[DEBUG_REDIRECTS] redirecting ${req.nextUrl.pathname} to ${destination}`
      )
    }
    if (destination.startsWith('http')) {
      return NextResponse.redirect(destination, permanent ? 308 : 307)
    }

    // Next.js doesn't support redirecting to a pathname, so we clone the
    // request URL to adjust the pathname in an absolute URL
    const url = req.nextUrl.clone()
    url.pathname = destination
    return NextResponse.redirect(url, permanent ? 308 : 307)
  }

  // Handle Opt-in cookies
  const params = req.nextUrl.searchParams
  const optInPlatform = params.get('optInFrom') as OptInPlatformOption
  const hasOptedIn = Boolean(req.cookies[`${optInPlatform}-beta-opt-in`])
  const response = NextResponse.next()

  if (optInPlatform && !hasOptedIn) {
    response.cookie(`${optInPlatform}-beta-opt-in`, 'true', {
      maxAge: OPT_IN_MAX_AGE,
    })
  }

  // Continue request processing
  return response
}
