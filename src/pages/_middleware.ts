import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import redirects from 'data/_redirects.generated.json'

const HOSTNAME_MAP = {
  'www.boundaryproject.io': 'boundary',
  'test-bd.hashi-mktg.com': 'boundary',
}

function determineProductSlug(req: NextRequest): string | null {
  // .io preview on dev portal
  if (req.cookies.io_preview) {
    return req.cookies.io_preview
  }

  // deploy preview in product repo and local preview
  if (process.env.DEV_IO) {
    return process.env.DEV_IO
  }

  // .io production deploy
  if (req.nextUrl.hostname in HOSTNAME_MAP) {
    return HOSTNAME_MAP[req.nextUrl.hostname]
  }

  return null
}

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const product = determineProductSlug(req)
  if (process.env.DEBUG_REDIRECTS) {
    console.log(`[DEBUG_REDIRECTS] determined product to be: ${product}`)
  }
  if (product && redirects[product]) {
    if (req.nextUrl.pathname in redirects[product]) {
      const { destination, permanent } = redirects[product][
        req.nextUrl.pathname
      ]
      if (process.env.DEBUG_REDIRECTS) {
        console.log(
          `[DEBUG_REDIRECTS] redirecting ${req.nextUrl.pathname} to ${destination}`
        )
      }
      return NextResponse.redirect(destination, permanent ? 308 : 307)
    }
  }

  return NextResponse.next()
}
