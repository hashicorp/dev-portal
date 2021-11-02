import DocsPage from '@hashicorp/react-docs-page'
import {
  generateStaticPaths,
  generateStaticProps,
} from '@hashicorp/react-docs-page/server'
import waypointConfig from '../../../../config/waypoint.json'
import Placement from 'components/author-primitives/shared/placement-table'
import NestedNode from 'components/author-primitives/waypoint/nested-node'
import WaypointIoLayout from 'layouts/_proxied-dot-io/waypoint'

// because some of the util functions still require param arity, but we ignore
// their values when process.env.ENABLE_VERSIONED_DOCS is set to true, we'll
// just use this string to make it clear by using this k/v
const temporary_noop = 'im just for show'

const productName = waypointConfig.name
const productSlug = waypointConfig.slug
const basePath = 'docs'
const additionalComponents = { Placement, NestedNode }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function DocsLayout(props) {
  return (
    <DocsPage
      product={{ name: productName, slug: productSlug }}
      baseRoute={basePath}
      staticProps={props}
      showVersionSelect={!!+process.env.ENABLE_VERSIONED_DOCS}
      additionalComponents={additionalComponents}
    />
  )
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
  const props = await generateStaticProps({
    navDataFile: temporary_noop,
    localContentDir: temporary_noop,
    product: { name: productName, slug: productSlug },
    params,
    basePath,
  })
  return {
    props,
    revalidate: 10,
  }
}

DocsLayout.layout = WaypointIoLayout
export default DocsLayout
