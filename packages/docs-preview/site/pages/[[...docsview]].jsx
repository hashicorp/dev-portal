// import { productName, productSlug, mainBranch } from 'data/metadata'
// import DocsPage from '@hashicorp/react-docs-page'
// additional components
// import Placement from 'components/waypoint/placement-table'
// import NestedNode from 'components/waypoint/nested-node'
// import ConfigEntryReference from 'components/consul/config-entry-reference'
// imports below are used on server only
// import {
//   generateStaticPaths,
//   generateStaticProps,
// } from '@hashicorp/react-docs-page/server'

// configures for this specific basepath
// const basePath = 'plugins'

// note: adds components for all possible product environments
// const additionalComponents = { ConfigEntryReference, Placement, NestedNode }
// const navDataFile = `./data/${basePath}-nav-data.json`
// const localContentDir = `./content/${basePath}`

export default function DocsLayout({ params }) {
  return (
    <pre>
      <code>{JSON.stringify(params, null, 2)}</code>
    </pre>
  )
  //   return (
  //     <DocsPage
  //       product={product}
  //       baseRoute={basePath}
  //       staticProps={staticProps}
  //       additionalComponents={additionalComponents}
  //     />
  //   )
}

export async function getStaticPaths() {
  const allPathArrays = [['foo'], ['bar', 'baz']]
  return {
    fallback: false,
    paths: allPathArrays.map((p) => ({ params: { docsview: p } })),
  }
}

export async function getStaticProps({ params }) {
  return { props: { params } }
  //   const product = {
  //     name: productName,
  //     slug: productSlug,
  //   }
  //   const staticProps = await generateStaticProps({
  //     navDataFile,
  //     localContentDir,
  //     mainBranch,
  //     product,
  //     params,
  //     additionalComponents,
  //   })
  //   return {
  //     props: {
  //       product,
  //       staticProps,
  //     },
  //   }
}
