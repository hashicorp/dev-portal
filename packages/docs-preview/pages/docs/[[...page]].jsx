import DocsPage from '@hashicorp/react-docs-page'
// additional components
import Placement from 'components/waypoint/placement-table'
import NestedNode from 'components/waypoint/nested-node'
import ConfigEntryReference from 'components/consul/config-entry-reference'
// imports below are used on server only
import path from 'path'
import {
  generateStaticPaths,
  generateStaticProps,
} from '@hashicorp/react-docs-page/server'

const PRODUCT_SLUG = process.env.NEXT_PUBLIC_DOCS_PREVIEW_PRODUCT
const NEXT_PUBLIC_CWD = process.env.NEXT_PUBLIC_CWD

const PRODUCT_DICT = {
  waypoint: {
    mainBranch: 'main',

    product: {
      name: 'Waypoint',
      slug: 'waypoint',
    },
  },
  consul: {
    mainBranch: 'main',
    product: {
      name: 'Consul',
      slug: 'consul',
    },
  },
}
const { product, mainBranch } = PRODUCT_DICT[PRODUCT_SLUG]

const NAV_DATA_FILE = 'data/docs-nav-data.json'
const CONTENT_DIR = 'content/docs'
const basePath = 'docs'
// note: adds components for all possible product environments
const additionalComponents = { ConfigEntryReference, Placement, NestedNode }

export default function DocsLayout(props) {
  return (
    <DocsPage
      product={product}
      baseRoute={basePath}
      staticProps={props}
      additionalComponents={additionalComponents}
    />
  )
}

export async function getStaticPaths() {
  const navDataFile = getRelativePathFromCwd(NAV_DATA_FILE)
  const localContentDir = getRelativePathFromCwd(CONTENT_DIR)
  return {
    fallback: false,
    paths: await generateStaticPaths({
      navDataFile,
      localContentDir,
    }),
  }
}

export async function getStaticProps({ params }) {
  const navDataFile = getRelativePathFromCwd(NAV_DATA_FILE)
  const localContentDir = getRelativePathFromCwd(CONTENT_DIR)
  return {
    props: await generateStaticProps({
      navDataFile,
      localContentDir,
      mainBranch,
      product,
      params,
      additionalComponents,
    }),
  }
}

function getRelativePathFromCwd(pathFromProduct) {
  const absolutePath = path.join(NEXT_PUBLIC_CWD, pathFromProduct)
  return path.relative(process.cwd(), absolutePath)
}
