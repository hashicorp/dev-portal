import { ReactElement, useMemo } from 'react'
import { MDXRemote } from 'next-mdx-remote'
import defaultMdxComponents from '@hashicorp/platform-docs-mdx'
import { useCurrentProduct } from 'contexts'
import Placement from 'components/author-primitives/shared/placement-table'
import NestedNode from 'components/author-primitives/waypoint/nested-node'
import DocsAnchor from 'components/docs-anchor'

/**
 * TODO: we may find that we want to allow additional components to be passed in
 * as a prop in the future
 */
const DocsPage = (props): ReactElement => {
  const currentProduct = useCurrentProduct()

  const additionalComponents = useMemo(
    () =>
      defaultMdxComponents({
        product: currentProduct.slug,
        additionalComponents: {
          Placement,
          NestedNode,
          a: DocsAnchor,
        },
      }),
    [currentProduct.slug]
  )

  return <MDXRemote {...props} components={additionalComponents} />
}

export default DocsPage
