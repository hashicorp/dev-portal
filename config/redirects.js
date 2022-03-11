//@ts-check

const fs = require('fs')
const path = require('path')
const proxySettings = require('./proxy-settings')
const {
  getProxiedProductSlug,
  isPreview,
  isDeployPreview,
} = require('../src/lib/env-checks')
const fetchGithubFile = require('./fetch-github-file')
const { isContentDeployPreview } = require('../src/lib/env-checks')

/** @typedef { import("next/dist/lib/load-custom-routes").Redirect } Redirect  */

const DEV_PORTAL_DOMAIN = 'https://hashi-dev-portal.vercel.app'

const PROXIED_PRODUCT = getProxiedProductSlug()

// Redirect all proxied product pages
// to the appropriate product domain
//
// Note: we do this for ALL domains, as we never want visitors to
// see the original "proxied" routes, no matter what domain they're on.
const productsToProxy = Object.keys(proxySettings)
// In preview environments, it's actually nice to NOT have these redirects,
// as they prevent us from seeing the content we build for the preview URL
/** @type {Redirect[]} */
const devPortalToDotIoRedirects = isPreview()
  ? []
  : productsToProxy.reduce((acc, slug) => {
      const routesToProxy = proxySettings[slug].routesToProxy
      // If we're trying to test this product's redirects in dev,
      // then we'll set the domain to an empty string for absolute URLs
      const domain = slug == PROXIED_PRODUCT ? '' : proxySettings[slug].domain
      const toDotIoRedirects = routesToProxy.map(
        ({ proxiedRoute, localRoute }) => {
          return {
            source: localRoute,
            destination: domain + proxiedRoute,
            permanent: false,
          }
        }
      )
      return acc.concat(toDotIoRedirects)
    }, [])

// Redirect dev-portal routes to the dev-portal domain,
// if we're on the proxied domain.
//
// (Note: without these redirects, dev-portal routes will be visible and
// indexed by search engines on our proxied .io domains, which seems
// like it could cause problems)
// TODO: this is a simple single route, we'd probably want to redirect all dev-portal routes
// We could likely come up with a way to determine a full list automatically:
// 1. list all dev routes, ie everything except what's in /_proxied-dot-io/*
// 2. for each product domain, build a redirect so that when /some-dev-portal-route
//    is visited on that product domain, it redirects to dev-portal
const devPortalRoutes = ['/some-dev-portal-route']
/** @type {Redirect[]} */
const dotIoToDevPortalRedirects = productsToProxy.reduce((acc, productSlug) => {
  const productHost = proxySettings[productSlug].host
  const toDevPortalRedirects = devPortalRoutes.map((devPortalRoute) => {
    return {
      source: devPortalRoute,
      destination: DEV_PORTAL_DOMAIN + devPortalRoute,
      permanent: false,
      has: [
        {
          type: 'host',
          value: productHost,
        },
      ],
    }
  })
  return acc.concat(toDevPortalRedirects)
}, [])

/**
 *
 * @param {Redirect[]} redirects
 * @param {string} productSlug
 * @returns {Redirect[]}
 */
function addHostCondition(redirects, productSlug) {
  const host = proxySettings[productSlug].host
  return redirects.map((redirect) => {
    if (productSlug == PROXIED_PRODUCT) return redirect
    // To enable previewing of .io sites, we accept an io_preview cookie which must have a value matching a product slug
    if (isPreview()) {
      return {
        ...redirect,
        has: [
          {
            type: 'cookie',
            key: 'io_preview',
            value: productSlug,
          },
        ],
      }
    }
    return {
      ...redirect,
      has: [
        {
          type: 'host',
          value: host,
        },
      ],
    }
  })
}

async function buildDotIoRedirects() {
  // Fetch author-oriented redirects from product repos,
  // and merge those with dev-oriented redirects from
  // within this repository

  // ... for Boundary
  const rawBoundaryRedirects = isContentDeployPreview('boundary')
    ? fs.readFileSync(path.join(process.cwd(), '../redirects.js'), 'utf-8')
    : isDeployPreview()
    ? '[]'
    : await fetchGithubFile({
        owner: 'hashicorp',
        repo: 'boundary',
        path: 'website/redirects.js',
        ref: 'stable-website',
      })
  const boundaryAuthorRedirects = eval(rawBoundaryRedirects)
  // TODO: split non-author redirects into dev-portal,
  // TODO: rather than leaving all redirects in the Boundary repo
  // TODO: intent is to do this after all products have been migrated
  const boundaryIoRedirects = [...boundaryAuthorRedirects]
  // ... for Nomad
  const rawNomadRedirects = isContentDeployPreview('nomad')
    ? fs.readFileSync(path.join(process.cwd(), '../redirects.js'), 'utf-8')
    : isDeployPreview()
    ? '[]'
    : await fetchGithubFile({
        owner: 'hashicorp',
        repo: 'nomad',
        path: 'website/redirects.js',
        ref: 'stable-website',
      })
  const nomadAuthorRedirects = eval(rawNomadRedirects)
  // TODO: split non-author redirects into dev-portal,
  // TODO: rather than leaving all redirects in the nomad repo
  // TODO: intent is to do this after all products have been migrated
  const nomadIoRedirects = [...nomadAuthorRedirects]
  // ... for Sentinel
  // TODO: sentinel is a private repo.
  // TODO: we need a solution to fetch specific, public-friendly
  // TODO: assets from the repo. The content API will likely lead the
  // TODO: way here - as this is needed to render images in Sentinel docs,
  // TODO: see for example:
  // TODO: https://sentinel-git-kevin-versioned-docs-hashicorp.vercel.app/sentinel/extending/internals
  // const rawSentinelRedirects = isContentDeployPreview('sentinel')
  //   ? fs.readFileSync(path.join(process.cwd(), '../redirects.next.js'), 'utf-8')
  //   : isDeployPreview()
  //   ? []
  //   : await fetchGithubFile({
  //       owner: 'hashicorp',
  //       repo: 'sentinel',
  //       path: 'website/redirects.next.js',
  //       ref: 'stable-website',
  //     })
  // ... for Waypoint
  const rawWaypointRedirects = isContentDeployPreview('waypoint')
    ? fs.readFileSync(path.join(process.cwd(), '../redirects.js'), 'utf-8')
    : isDeployPreview()
    ? '[]'
    : await fetchGithubFile({
        owner: 'hashicorp',
        repo: 'waypoint',
        path: 'website/redirects.js',
        ref: 'stable-website',
      })
  const waypointAuthorRedirects = eval(rawWaypointRedirects)
  // TODO: split non-author redirects into dev-portal,
  // TODO: rather than leaving all redirects in the Waypoint repo
  // TODO: intent is to do this after all products have been migrated
  const waypointIoRedirects = [...waypointAuthorRedirects]

  const sentinelIoRedirects = [
    {
      source: '/',
      destination: '/sentinel',
      permanent: true,
    },
    {
      source: '/sentinel/commands/config',
      destination: '/sentinel/configuration',
      permanent: true,
    },
    // disallow '.html' or '/index.html' in favor of cleaner, simpler paths
    { source: '/:path*/index', destination: '/:path*', permanent: true },
    { source: '/:path*.html', destination: '/:path*', permanent: true },
  ]

  const rawVaultRedirects = isContentDeployPreview('vault')
    ? fs.readFileSync(path.join(process.cwd(), '../redirects.js'), 'utf-8')
    : isDeployPreview()
    ? '[]'
    : await fetchGithubFile({
        owner: 'hashicorp',
        repo: 'vault',
        path: 'website/redirects.next.js',
        ref: 'stable-website',
      })
  const vaultAuthorRedirects = eval(rawVaultRedirects)
  // TODO: split non-author redirects into dev-portal,
  // TODO: rather than leaving all redirects in the Waypoint repo
  // TODO: intent is to do this after all products have been migrated
  const vaultIoRedirects = [...vaultAuthorRedirects]

  const rawVagrantRedirects = isContentDeployPreview('vagrant')
    ? fs.readFileSync(path.join(process.cwd(), '../redirects.js'), 'utf-8')
    : isDeployPreview()
    ? '[]'
    : await fetchGithubFile({
        owner: 'hashicorp',
        repo: 'vagrant',
        path: 'website/redirects.next.js',
        ref: 'stable-website',
      })
  const vagrantAuthorRedirects = eval(rawVagrantRedirects)
  // TODO: split non-author redirects into dev-portal,
  // TODO: rather than leaving all redirects in the Vagrant repo
  // TODO: intent is to do this after all products have been migrated
  const vagrantIoRedirects = [...vagrantAuthorRedirects]

  const rawPackerRedirects = isContentDeployPreview('packer')
    ? fs.readFileSync(path.join(process.cwd(), '../redirects.js'), 'utf-8')
    : isDeployPreview()
    ? '[]'
    : await fetchGithubFile({
        owner: 'hashicorp',
        repo: 'packer',
        path: 'website/redirects.next.js',
        ref: 'stable-website',
      })
  const packerAuthorRedirects = eval(rawPackerRedirects)
  // TODO: split non-author redirects into dev-portal,
  // TODO: rather than leaving all redirects in the Packer repo
  // TODO: intent is to do this after all products have been migrated
  const packerIoRedirects = [...packerAuthorRedirects]

  const rawConsulRedirects = isContentDeployPreview('consul')
    ? fs.readFileSync(path.join(process.cwd(), '../redirects.js'), 'utf-8')
    : isDeployPreview()
    ? '[]'
    : await fetchGithubFile({
        owner: 'hashicorp',
        repo: 'consul',
        path: 'website/redirects.next.js',
        ref: 'stable-website',
      })
  const consulAuthorRedirects = eval(rawConsulRedirects)
  // TODO: split non-author redirects into dev-portal,
  // TODO: rather than leaving all redirects in the Packer repo
  // TODO: intent is to do this after all products have been migrated
  const consulIoRedirects = [...consulAuthorRedirects]
  // TODO ... consolidate redirects for other products
  return [
    ...devPortalToDotIoRedirects,
    ...dotIoToDevPortalRedirects,
    ...addHostCondition(boundaryIoRedirects, 'boundary'),
    ...addHostCondition(nomadIoRedirects, 'nomad'),
    ...addHostCondition(sentinelIoRedirects, 'sentinel'),
    ...addHostCondition(vaultIoRedirects, 'vault'),
    ...addHostCondition(waypointIoRedirects, 'waypoint'),
    ...addHostCondition(vagrantIoRedirects, 'vagrant'),
    ...addHostCondition(packerIoRedirects, 'packer'),
    ...addHostCondition(consulIoRedirects, 'consul'),
  ]
}

async function redirectsConfig() {
  const dotIoRedirects = await buildDotIoRedirects()
  return [...dotIoRedirects]
}

module.exports = redirectsConfig
