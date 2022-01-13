import { ReactElement } from 'react'
import waypointData from 'data/waypoint.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/docs/server'
import DocsLayout from 'layouts/docs'
import DocsView from 'views/docs-view'
import Placement from 'components/author-primitives/shared/placement-table'
import NestedNode from 'components/author-primitives/waypoint/nested-node'

const basePath = 'commands'
const baseName = 'Commands'
const product = waypointData as Product
const additionalComponents = {
  Placement,
  NestedNode,
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function WaypointCommandsPage({ mdxSource }): ReactElement {
  return <DocsView {...mdxSource} additionalComponents={additionalComponents} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
})

WaypointCommandsPage.layout = DocsLayout

export { getStaticPaths, getStaticProps }
export default WaypointCommandsPage
