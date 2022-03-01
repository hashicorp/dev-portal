import packerData from 'data/packer.json'
import { Product } from 'types/products'
import DocsView from 'views/docs-view'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'

const basePath = 'docs'
const baseName = 'Docs'
const product = packerData as Product

const PackerDocsPage = ({ mdxSource }): React.ReactElement => {
  return <DocsView {...mdxSource} />
}

const {
  getStaticPaths: genGetStaticPaths,
  getStaticProps: genGetStaticProps,
} = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
})

export async function getStaticPaths(ctx) {
  const genPaths = await genGetStaticPaths(ctx)
  console.log({ genPaths })
  return genPaths
}

export async function getStaticProps({ params }) {
  const genProps = await genGetStaticProps({ params })
  console.log({ genProps })
  return genProps
}

PackerDocsPage.layout = SidebarSidecarLayout

// export { getStaticProps }
export default PackerDocsPage
