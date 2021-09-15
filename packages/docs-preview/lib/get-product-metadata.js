import fs from 'fs'
import path from 'path'

function getProductMetadata(productWebsiteDir) {
  const metadataFile = path.join(productWebsiteDir, 'data', 'metadata.json')
  const metadata = JSON.parse(fs.readFileSync(metadataFile))
  return metadata
}

export default getProductMetadata
