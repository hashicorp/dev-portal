import { ReactElement } from 'react'
import { MDXRemote } from 'next-mdx-remote'
import defaultMdxComponents from '@hashicorp/platform-docs-mdx'
import Placement from 'components/author-primitives/shared/placement-table'
import NestedNode from 'components/author-primitives/waypoint/nested-node'

const additionalComponents = defaultMdxComponents('waypoint', {
  Placement,
  NestedNode,
})

const DocsPage = (props): ReactElement => {
  return <MDXRemote {...props} components={additionalComponents} />
}

export default DocsPage
