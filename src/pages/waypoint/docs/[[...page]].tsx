// import DocsPage from '@hashicorp/react-docs-page'
import {
  generateStaticPaths,
  generateStaticProps,
} from '@hashicorp/react-docs-page/server'
import { anchorLinks } from '@hashicorp/remark-plugins'
import { MDXRemote } from 'next-mdx-remote'
import waypointConfig from '../../../../config/waypoint.json'
import Placement from 'components/author-primitives/shared/placement-table'
import NestedNode from 'components/author-primitives/waypoint/nested-node'
import DocsLayout from 'layouts/docs'

// because some of the util functions still require param arity, but we ignore
// their values when process.env.ENABLE_VERSIONED_DOCS is set to true, we'll
// just use this string to make it clear by using this k/v
const temporary_noop = 'im just for show'

const productName = waypointConfig.name
const productSlug = waypointConfig.slug
const basePath = 'docs'
const additionalComponents = { Placement, NestedNode }

// TODO: inline styles will be removed in a follow-up layout task (ref: https://app.asana.com/0/0/1201217826547576/f)
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function WaypointDocsPage(props) {
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

// Needs to be DocsLayout in the assembly-ui-v1 branch for now
WaypointDocsPage.layout = DocsLayout

export default WaypointDocsPage
