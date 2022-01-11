import { ReactElement } from 'react'
import waypointData from 'data/waypoint.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/docs/server'
import DocsLayout from 'layouts/docs'
import { MDXRemote } from 'next-mdx-remote'
import { waypointMdxComponents as components } from 'layouts/docs/utils/mdx-components'

const basePath = 'plugins'
const product = waypointData as Product

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function WaypointPluginsPage({ mdxSource }): ReactElement {
  return <MDXRemote {...mdxSource} components={components} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
})

WaypointPluginsPage.layout = DocsLayout
export { getStaticPaths, getStaticProps }
export default WaypointPluginsPage
