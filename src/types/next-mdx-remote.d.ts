declare module 'next-mdx-remote' {
  export interface MDXRemoteSerializeResult {
    compiledSource: string
    scope?: Record<string, unknown>
    frontmatter?: Record<string, unknown>
  }

  export interface MDXRemoteProps {
    compiledSource: string
    scope?: Record<string, unknown>
    frontmatter?: Record<string, unknown>
  }

  export function MDXRemote(props: MDXRemoteProps): JSX.Element
}

declare module 'next-mdx-remote/serialize' {
  import { MDXRemoteSerializeResult } from 'next-mdx-remote'

  export function serialize(
    source: string,
    options?: {
      scope?: Record<string, unknown>
      mdxOptions?: Record<string, unknown>
      parseFrontmatter?: boolean
    }
  ): Promise<MDXRemoteSerializeResult>
} 