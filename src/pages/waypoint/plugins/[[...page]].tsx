import { ReactElement } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import waypointData from 'data/waypoint.json'
import { Product } from 'types/products'
import { generateStaticPaths, generateStaticProps } from 'layouts/docs/server'
import DocsLayout from 'layouts/docs'
import DocsPage from 'components/docs-page'

const basePath = 'plugins'
const product = waypointData as Product

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const WaypointPluginsPage = ({ mdxSource }): ReactElement => {
  return <DocsPage {...mdxSource} />
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: await generateStaticPaths({ basePath, product }),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: await generateStaticProps({ basePath, product, params }),
    revalidate: 10,
  }
}

WaypointPluginsPage.layout = DocsLayout

export default WaypointPluginsPage
