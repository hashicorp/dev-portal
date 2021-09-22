/*
NOTE:
apart from a different `const basepath` declaration,
this file is duplicated between:
- pages/api-docs/[[...page.jsx]]
- pages/commands/[[...page.jsx]]
- pages/docs/[[...page.jsx]]
- pages/plugins/[[...page.jsx]]
*/

import { productName, productSlug, mainBranch } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
// additional components
import Placement from 'components/waypoint/placement-table'
import NestedNode from 'components/waypoint/nested-node'
import ConfigEntryReference from 'components/consul/config-entry-reference'
// imports below are used on server only
import fs from 'fs'
import path from 'path'
import {
  generateStaticPaths,
  generateStaticProps,
} from '@hashicorp/react-docs-page/server'

// configures for this specific basepath
const basePath = 'api-docs'

// note: adds components for all possible product environments
const additionalComponents = { ConfigEntryReference, Placement, NestedNode }
const navDataFile = `./data/${basePath}-nav-data.json`
const localContentDir = `./content/${basePath}`

export default function DocsLayout({ product, staticProps }) {
  if (!staticProps) return <div>Hello world!</div>
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
  // It's possible a product does not have an api-docs page,
  // if this is the case, then ignore this route
  if (!fs.existsSync(path.join(process.cwd(), navDataFile))) {
    return { fallback: false, paths: [] }
  }
  // Otherwise, render the page as usual
  return {
    fallback: false,
    paths: await generateStaticPaths({
      navDataFile,
      localContentDir,
    }),
  }
}

export async function getStaticProps({ params }) {
  // It's possible a product does not have an api-docs page,
  // if this is the case, then ignore this route
  if (!fs.existsSync(path.join(process.cwd(), navDataFile))) {
    return { props: {} }
  }
  // Otherwise, render the page as usual
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
