import { ReactElement } from 'react'
import { MDXRemote } from 'next-mdx-remote'
import defaultMdxComponents from '@hashicorp/platform-docs-mdx'
import Placement from 'components/author-primitives/shared/placement-table'
import NestedNode from 'components/author-primitives/waypoint/nested-node'
import makeDocsAnchor from 'components/docs-anchor'

/**
 * TODO: this will eventually be configurable by all products, not just waypoint
 */
const additionalComponents = defaultMdxComponents({
  product: 'waypoint',
  additionalComponents: {
    Placement,
    NestedNode,
    a: makeDocsAnchor('waypoint', ['docs', 'plugins', 'commands']),
  },
})

/**
 * TODO: we may find that we want to allow additional components to be passed in
 * as a prop in the future
 */
const DocsPage = (props): ReactElement => {
  return <MDXRemote {...props} components={additionalComponents} />
}

export default DocsPage
