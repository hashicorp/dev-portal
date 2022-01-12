import { ReactElement } from 'react'
import waypointData from 'data/waypoint.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/docs/server'
import DocsLayout from 'layouts/docs'
import DocsPage from 'components/docs-page'

const basePath = 'commands'
const product = waypointData as Product

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const WaypointCommandsPage = ({ mdxSource }): ReactElement => {
  return <DocsPage {...mdxSource} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
})

WaypointCommandsPage.layout = DocsLayout

export { getStaticPaths, getStaticProps }
export default WaypointCommandsPage
