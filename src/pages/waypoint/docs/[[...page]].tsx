import DocsPage from '@hashicorp/react-docs-page'
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'
import Placement from 'components/author-primitives/shared/placement-table'
import NestedNode from 'components/author-primitives/waypoint/nested-node'

const productName = 'Waypoint'
const productSlug = 'waypoint'
const basePath = 'docs'
const additionalComponents = { Placement, NestedNode }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function DocsLayout(props) {
  return (
    <DocsPage
      product={{ name: productName, slug: productSlug }}
      baseRoute={`${productSlug}/${basePath}`}
      staticProps={props}
      showVersionSelect={!!+process.env.ENABLE_VERSIONED_DOCS}
      additionalComponents={additionalComponents}
    />
  )
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  strategy: 'remote',
  // can we infer basePath using __dirname or something?
  basePath,
  product: productSlug,
  fallback: 'blocking',
  revalidate: 10,
})

export { getStaticPaths, getStaticProps }
