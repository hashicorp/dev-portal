const fetchFileString = require('./fetch-file-string')

const API_URL = `https://mktg-content-api-hashicorp.vercel.app`
const API_ASSETS = `/api/assets`
async function fetchContentApiFileString({ product, filePath, version }) {
  const [p, v, fp] = [product, version, filePath].map(encodeURIComponent)
  const url = `${API_URL}${API_ASSETS}?product=${p}&version=${v}&asset=${fp}`
  return await fetchFileString(url)
}

module.exports = fetchContentApiFileString
