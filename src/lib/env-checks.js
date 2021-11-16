function isPreview() {
  return process.env.HASHI_ENV == 'preview'
}

function isProxiedProduct(productSlug) {
  const isDevEnvSet = process.env.DEV_IO_PROXY == productSlug
  const commitMsg = process.env.VERCEL_GIT_COMMIT_MESSAGE || ''
  const isCommitMatch = commitMsg.indexOf(`(${productSlug})`) !== -1
  console.log({ isDevEnvSet, isCommitMatch })
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
  isPreview,
  isProxiedProduct,
  isContentDeployPreview,
  isVersionedDocsEnabled,
}
