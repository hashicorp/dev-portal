import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { HOSTNAME_MAP } from 'constants/hostname-map'

export function middleware(req: NextRequest, ev: NextFetchEvent): NextResponse {
  const params = req.nextUrl.searchParams
  const next = NextResponse.next()

  if (params.get('betaOptOut') === 'true') {
    const product = HOSTNAME_MAP[req.nextUrl.hostname]

    next.clearCookie(`${product}-io-beta-opt-in`)
  }

  return next
}
