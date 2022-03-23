import packerData from 'data/packer.json'
import { Product } from 'types/products'
import DocsView from 'views/docs-view'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'

const basePath = 'intro'
const baseName = 'Intro'
const product = packerData as Product
const mainBranch = 'master'

const PackerIntroPage = ({ mdxSource }): React.ReactElement => {
  return <DocsView mdxSource={mdxSource} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
  mainBranch,
})

PackerIntroPage.layout = SidebarSidecarLayout

export { getStaticProps, getStaticPaths }
export default PackerIntroPage
