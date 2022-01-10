import { generateStaticPaths, generateStaticProps } from 'layouts/docs/server'
import terraformConfig from '../../../../config/waypoint.json'
import DocsLayout from 'layouts/docs'
import DocsPage from 'components/docs-page'

const basePath = 'language'
const product = {
  name: terraformConfig.name,
  slug: 'terraform-website',
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
