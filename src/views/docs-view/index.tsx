import { ReactElement, ReactNode } from 'react'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import defaultMdxComponents from 'layouts/sidebar-sidecar/utils/_local_platform-docs-mdx'

export interface DocsViewProps {
  additionalComponents?: Record<string, ReactNode>
  mdxSource: MDXRemoteSerializeResult
  lazy?: boolean
}

const DocsView = ({
  additionalComponents = {},
  mdxSource,
  lazy,
}: DocsViewProps): ReactElement => {
  const { compiledSource, scope } = mdxSource
  const components = defaultMdxComponents({ additionalComponents })
  return (
    <MDXRemote {...{ compiledSource, scope, lazy }} components={components} />
  )
}

export default DocsView
