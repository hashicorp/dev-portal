import { ReactElement } from 'react'
import vaultData from 'data/vault.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/docs/server'
import DocsLayout from 'layouts/docs'
import DocsView from 'views/docs-view'

const basePath = 'api-docs'
const product = vaultData as Product

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function VaultApiDocsPage({ mdxSource }): ReactElement {
  return <DocsView {...mdxSource} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
})

VaultApiDocsPage.layout = DocsLayout

export { getStaticPaths, getStaticProps }
export default VaultApiDocsPage
