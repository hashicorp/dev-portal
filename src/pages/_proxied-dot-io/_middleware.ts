import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { HOSTNAME_MAP } from 'constants/hostname-map'

/**
 * Handles opt-out from the dev-portal beta when betaOptOut=true is passed to an .io site
 * This assumes that the path they are visiting is correct and does not need to be redirect in any way.
 *
 * Navigating to the correct path should be handled by /src/components/opt-in-out/index.tsx.
 */
export function middleware(req: NextRequest, ev: NextFetchEvent): NextResponse {
  const params = req.nextUrl.searchParams
  const next = NextResponse.next()

  if (params.get('betaOptOut') === 'true') {
    const product = HOSTNAME_MAP[req.nextUrl.hostname]

    next.clearCookie(`${product}-io-beta-opt-in`)
  }

  return next
}
