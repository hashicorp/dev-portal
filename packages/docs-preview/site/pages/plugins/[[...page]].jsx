import { productName, productSlug, mainBranch } from 'data/metadata'
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

// configures for this specific basepath
const basePath = 'plugins'

// note: adds components for all possible product environments
const additionalComponents = { ConfigEntryReference, Placement, NestedNode }
const navDataFile = `./data/${basePath}-nav-data.json`
const localContentDir = `./content/${basePath}`

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
      navDataFile,
      localContentDir,
    }),
  }
}

export async function getStaticProps({ params }) {
  const product = {
    name: productName,
    slug: productSlug,
  }
  const staticProps = await generateStaticProps({
    navDataFile,
    localContentDir,
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
