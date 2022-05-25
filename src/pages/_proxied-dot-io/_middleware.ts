import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

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

export function middleware(req: NextRequest, ev: NextFetchEvent): NextResponse {
  const params = req.nextUrl.searchParams
  const next = NextResponse.next()

  if (params.get('betaOptOut') === 'true') {
    const product = HOSTNAME_MAP[req.nextUrl.hostname]

    next.clearCookie(`${product}-io-beta-opt-in`)
  }

  return next
}
