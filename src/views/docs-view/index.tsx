import { ReactElement } from 'react'
import { MDXRemote } from 'next-mdx-remote'
import defaultMdxComponents from 'layouts/docs/utils/_local_platform-docs-mdx'

const DocsView = ({
  additionalComponents = {},
  compiledSource,
  scope,
  lazy,
}: {
  additionalComponents: Record<string, ReactElement>
  compiledSource: string
  scope: Record<string, unknown>
  lazy?: boolean
}): ReactElement => {
  const components = defaultMdxComponents({ additionalComponents })
  return (
    <MDXRemote {...{ compiledSource, scope, lazy }} components={components} />
  )
}

export default DocsView
