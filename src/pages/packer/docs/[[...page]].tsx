import packerData from 'data/packer.json'
import { Product } from 'types/products'
import DocsView from 'views/docs-view'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
// Author primitives
import Badge from 'components/author-primitives/packer/badge'
import BadgesHeader from 'components/author-primitives/packer/badges-header'
import PluginBadge from 'components/author-primitives/packer/plugin-badge'
import Checklist from 'components/author-primitives/packer/checklist'

const basePath = 'docs'
const baseName = 'Docs'
const product = packerData as Product
const additionalComponents = { Badge, BadgesHeader, PluginBadge, Checklist }

const PackerDocsPage = ({ mdxSource }): React.ReactElement => {
  return <DocsView {...mdxSource} additionalComponents={additionalComponents} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
})

PackerDocsPage.layout = SidebarSidecarLayout

export { getStaticProps, getStaticPaths }
export default PackerDocsPage
