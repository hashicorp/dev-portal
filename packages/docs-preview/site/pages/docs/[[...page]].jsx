import productMetadata from 'data/metadata.json'
import DocsPage from '@hashicorp/react-docs-page'
// additional components
import Placement from 'components/waypoint/placement-table'
import NestedNode from 'components/waypoint/nested-node'
import ConfigEntryReference from 'components/consul/config-entry-reference'
// imports below are used on server only
import {
  generateStaticPaths,
  generateStaticProps,
} from '@hashicorp/react-docs-page/server'

const NAV_DATA_FILE = './data/docs-nav-data.json'
const CONTENT_DIR = './content/docs'
const basePath = 'docs'
// note: adds components for all possible product environments
const additionalComponents = { ConfigEntryReference, Placement, NestedNode }

export default function DocsLayout({ product, staticProps }) {
  return (
    <DocsPage
      product={product}
      baseRoute={basePath}
      staticProps={staticProps}
      additionalComponents={additionalComponents}
    />
  )
}

export async function getStaticPaths() {
  return {
    fallback: false,
    paths: await generateStaticPaths({
      navDataFile: NAV_DATA_FILE,
      localContentDir: CONTENT_DIR,
    }),
  }
}

export async function getStaticProps({ params }) {
  const { product, mainBranch } = productMetadata
  const staticProps = await generateStaticProps({
    navDataFile: NAV_DATA_FILE,
    localContentDir: CONTENT_DIR,
    mainBranch,
    product,
    params,
    additionalComponents,
  })
  return {
    props: {
      product,
      staticProps,
    },
  }
}
