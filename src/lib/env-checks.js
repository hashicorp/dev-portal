// NOTE: this module uses CommonJS exports,
// as it must be required() into redirects and rewrites config,
// neither of which are transpiled.

const PROXIED_PRODUCTS = ['boundary', 'waypoint']

// function isProduction() {
//   return process.env.VERCEL_ENV == 'production'
// }

function isPreview() {
  return process.env.HASHI_ENV == 'preview'
}

function getProxiedProductSlug() {
  const proxiedProductSlug = PROXIED_PRODUCTS.reduce((acc, slug) => {
    if (!acc && isProxiedProduct(slug)) return slug
    return acc
  }, false)
  console.log({ proxiedProductSlug })
  return proxiedProductSlug
}

function isProxiedProduct(productSlug) {
  const isDevEnvSet = process.env.DEV_IO_PROXY == productSlug
  // Allow commit messages to trigger specific proxy settings...
  const commitMsg = process.env.VERCEL_GIT_COMMIT_MESSAGE || ''
  const commitFirstLine = commitMsg.split('\n')[0]
  const hasCommitFlag = commitFirstLine.indexOf(`(${productSlug})`) !== -1
  // ... but only if NOT in production
  const isOnMain = process.env.VERCEL_GIT_COMMIT_REF == 'main'
  const isCommitMatch = !isOnMain && hasCommitFlag
  console.log({ isDevEnvSet, isCommitMatch, isOnMain })
  return isDevEnvSet || isCommitMatch
}

// TODO: still experimenting with deploy preview approach
// isContentDeployPreview is a first attempt at building deploy
// previews in content repo contexts by cloning and building
// the dev-portal repository
function isContentDeployPreview(productSlug) {
  const isDeployPreview =
    process.env.IS_CONTENT_DEPLOY_PREVIEW && isProxiedProduct(productSlug)
  return isDeployPreview
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
  isVersionedDocsEnabled,
}
