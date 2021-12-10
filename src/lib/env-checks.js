const proxyConfig = require('../../config/proxy-config')

// NOTE: this module uses CommonJS exports,
// as it must be required() into redirects and rewrites config,
// neither of which are transpiled.

const PROXIED_PRODUCTS = Object.keys(proxyConfig)

function isPreview() {
  return process.env.HASHI_ENV == 'preview'
}

function getProxiedProductSlug(hostname) {
  const proxiedProductSlug = PROXIED_PRODUCTS.reduce((acc, slug) => {
    if (!acc && isProxiedProduct(slug, hostname)) return slug
    return acc
  }, false)
  return proxiedProductSlug
}

function getMatchedDomain(hostname) {
  const domainProductSlug = PROXIED_PRODUCTS.reduce((acc, slug) => {
    const productHost = proxyConfig[slug].host
    if (!acc && hostname == productHost) return slug
    return acc
  }, false)
  return domainProductSlug
}

function isProxiedProduct(productSlug, hostname) {
  const isDevEnvSet = process.env.DEV_IO == productSlug
  // Allow commit messages to trigger specific proxy settings,
  // but NOT if we're deploying off the main branch.
  const commitMsg =
    process.env.VERCEL_GIT_COMMIT_MESSAGE ||
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE ||
    ''
  const commitFirstLine = commitMsg.split('\n')[0]
  const isCommitMatch = commitFirstLine.indexOf(`(${productSlug})`) !== -1
  // ... but only if NOT in production
  const commitRef =
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF
  const isOnMain = commitRef == 'main'
  // When deploying to specific proxied domains,
  // this function should accurately reflect the proxied product
  const isDomainMatch = productSlug == getMatchedDomain(hostname)
  // Combine local and deployed settings
  const isLocalMatch = isDevEnvSet
  const isDeployedMatch = isDomainMatch || (isCommitMatch && !isOnMain)
  return isLocalMatch || isDeployedMatch
}

// TODO: still experimenting with deploy preview approach
// isContentDeployPreview is a first attempt at building deploy
// previews in content repo contexts by cloning and building
// the dev-portal repository
function isContentDeployPreview(productSlug) {
  return isDeployPreview() && isProxiedProduct(productSlug)
}

function isDeployPreview() {
  return process.env.IS_CONTENT_PREVIEW
}

function isVersionedDocsEnabled(productSlug) {
  const enableVersionedDocs =
    process.env.ENABLE_VERSIONED_DOCS &&
    process.env.ENABLE_VERSIONED_DOCS !== 'false'
  return enableVersionedDocs && !isContentDeployPreview(productSlug)
}

module.exports = {
  getProxiedProductSlug,
  isPreview,
  isContentDeployPreview,
  isDeployPreview,
  isVersionedDocsEnabled,
}
