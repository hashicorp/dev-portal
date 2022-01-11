import { generateStaticPaths, generateStaticProps } from 'layouts/docs/server'
import vaultConfig from 'data/vault.json'
import DocsLayout from 'layouts/docs'
import DocsPage from 'components/docs-page'

const basePath = 'api-docs'
const product = {
  name: vaultConfig.name,
  slug: vaultConfig.slug,
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function DocsView({ mdxSource }) {
  return <DocsPage {...mdxSource} />
}

export async function getStaticPaths() {
  return {
    paths: await generateStaticPaths({ basePath, product }),
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  return {
    props: await generateStaticProps({ basePath, product, params }),
    revalidate: 10,
  }
}

DocsView.layout = DocsLayout
export default DocsView
