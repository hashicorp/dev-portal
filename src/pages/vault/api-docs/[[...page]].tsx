import { ReactElement } from 'react'
import vaultData from 'data/vault.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/docs/server'
import DocsLayout from 'layouts/docs'
import { MDXRemote } from 'next-mdx-remote'
import { vaultMdxComponents as components } from 'layouts/docs/utils/mdx-components'

const basePath = 'api-docs'
const product = vaultData as Product

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function VaultApiDocsPage({ mdxSource }): ReactElement {
  return <MDXRemote {...mdxSource} components={components} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
})

VaultApiDocsPage.layout = DocsLayout

export { getStaticPaths, getStaticProps }
export default VaultApiDocsPage
