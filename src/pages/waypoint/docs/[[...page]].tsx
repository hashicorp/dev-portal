import { generateStaticPaths, generateStaticProps } from 'layouts/docs/server'
import waypointConfig from '../../../../config/waypoint.json'
import DocsLayout from 'layouts/docs'
import DocsPage from 'components/docs-page'

const basePath = 'docs'
const product = {
  name: waypointConfig.name,
  slug: waypointConfig.slug,
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
