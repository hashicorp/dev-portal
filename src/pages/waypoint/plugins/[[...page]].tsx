import {
  generateStaticPaths,
  generateStaticProps,
} from '@hashicorp/react-docs-page/server'
import { anchorLinks } from '@hashicorp/remark-plugins'
import waypointConfig from '../../../../config/waypoint.json'
import Placement from 'components/author-primitives/shared/placement-table'
import NestedNode from 'components/author-primitives/waypoint/nested-node'
import makeDocsAnchor from 'components/docs-anchor'
import DocsLayout from 'layouts/docs'
import { MDXRemote } from 'next-mdx-remote'

// because some of the util functions still require param arity, but we ignore
// their values when process.env.ENABLE_VERSIONED_DOCS is set to true, we'll
// just use this string to make it clear by using this k/v
const temporary_noop = 'im just for show'

const productName = waypointConfig.name
const productSlug = waypointConfig.slug
const basePath = 'plugins'
const additionalComponents = {
  Placement,
  NestedNode,
  a: makeDocsAnchor('waypoint', ['docs', 'plugins', 'commands']),
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function WaypointPluginsPage(props) {
  return <MDXRemote {...props.mdxSource} components={additionalComponents} />
}

export async function getStaticPaths() {
  const paths = await generateStaticPaths({
    navDataFile: temporary_noop,
    localContentDir: temporary_noop,
    // new ----
    product: { name: productName, slug: productSlug },
    basePath,
  })
  return {
    fallback: 'blocking',
    paths,
  }
}

export async function getStaticProps({ params }) {
  const headings = []

  const props = await generateStaticProps({
    basePath,
    localContentDir: temporary_noop,
    navDataFile: temporary_noop,
    params,
    product: { name: productName, slug: productSlug },
    remarkPlugins: [[anchorLinks, { headings }]],
  })

  return {
    props: {
      ...props,
      layoutProps: {
        headings,
        navData: props.navData,
      },
    },
    revalidate: 10,
  }
}

WaypointPluginsPage.layout = DocsLayout

export default WaypointPluginsPage
