import { getStaticGenerationFunctions } from 'layouts/docs/server'
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

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
})

export { getStaticPaths, getStaticProps }

DocsView.layout = DocsLayout
export default DocsView
