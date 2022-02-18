import DocsPage from '@hashicorp/react-docs-page'
import Badge from 'components/badge'
import BadgesHeader from 'components/badges-header'
import PluginBadge from 'components/plugin-badge'
import Checklist from 'components/checklist'
import productData from 'data/packer.json'
// Imports below are only used server-side
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'

//  Configure the docs path and remote plugin docs loading
const product = { name: productData.name, slug: productData.slug }
const basePath = 'docs'
const navDataFile = `../data/${basePath}-nav-data.json`
const localContentDir = `../content/${basePath}`
const localPartialsDir = `../content/partials`
const enableVersionedDocs = isVersionedDocsEnabled(productData.slug)
const additionalComponents = { Badge, BadgesHeader, PluginBadge, Checklist }
const mainBranch = 'master'

export default function DocsLayout({ isDevMissingRemotePlugins, ...props }) {
  return (
    <DocsPage
      product={product}
      baseRoute={basePath}
      staticProps={props}
      additionalComponents={additionalComponents}
      showVersionSelect={enableVersionedDocs}
      algoliaConfig={productData.algoliaConfig}
    />
  )
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions(
  process.env.ENABLE_VERSIONED_DOCS === 'true'
    ? {
        strategy: 'remote',
        basePath: baseRoute,
        fallback: 'blocking',
        revalidate: 360, // 1 hour
        product: product.slug,
        mainBranch: mainBranch,
      }
    : {
        strategy: 'fs',
        localContentDir,
        navDataFile,
        localPartialsDir,
        product: product.slug,
        revalidate: false,
        mainBranch: mainBranch,
      }
)

export { getStaticPaths, getStaticProps }
