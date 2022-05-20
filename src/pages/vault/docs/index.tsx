import vaultData from 'data/vault.json'
import { ProductData } from 'types/products'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import { generateGetStaticProps } from 'views/product-root-docs-path-landing/server'
import pageContent from './content.json'

const VaultDocsLanding = ({ pageHeading }) => {
  return (
    <ProductRootDocsPathLanding
      pageContent={pageContent}
      pageHeading={pageHeading}
    />
  )
}

const getStaticProps = generateGetStaticProps({
  baseName: 'Documentation',
  basePath: 'docs',
  pageContent,
  product: vaultData as ProductData,
})

VaultDocsLanding.layout = SidebarSidecarLayout
export { getStaticProps }
export default VaultDocsLanding
