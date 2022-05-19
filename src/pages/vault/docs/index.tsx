import vaultData from 'data/vault.json'
import { ProductData } from 'types/products'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import pageContent from './content.json'

const basePath = 'docs'
const baseName = 'Docs'
const product = vaultData as ProductData

const VaultDocsLanding = () => {
  return <ProductRootDocsPathLanding pageContent={pageContent} />
}

const { getStaticProps: generatedGetStaticProps } =
  getStaticGenerationFunctions({
    product,
    basePath,
    baseName,
  })

export async function getStaticProps({ context }) {
  // TODO: remove the any
  const generatedProps = (await generatedGetStaticProps({
    ...context,
    params: { page: [] },
  })) as any

  generatedProps.props.layoutProps.githubFileUrl = null

  // TODO handle rendering the sidecar in a follow-up PR
  generatedProps.props.layoutProps.sidecarSlot = null

  return generatedProps
}

VaultDocsLanding.layout = SidebarSidecarLayout
export default VaultDocsLanding
