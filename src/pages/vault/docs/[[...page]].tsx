import { ReactElement } from 'react'
import vaultData from 'data/vault.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/docs/server'
import DocsLayout from 'layouts/docs'
import DocsView from 'views/docs-view'
import Columns from 'components/author-primitives/vault/columns'
import InlineTag from 'components/author-primitives/vault/inline-tag'

const basePath = 'docs'
const product = vaultData as Product
const additionalComponents = {
  Columns,
  Tag: InlineTag,
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function VaultDocsPage({ mdxSource }): ReactElement {
  return <DocsView {...mdxSource} additionalComponents={additionalComponents} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
})

VaultDocsPage.layout = DocsLayout

export { getStaticPaths, getStaticProps }
export default VaultDocsPage
