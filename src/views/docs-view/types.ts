import { ReactNode } from 'react'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { ProductSlug } from 'types/products'

export interface DocsViewProps {
  mdxSource: MDXRemoteSerializeResult
  lazy?: boolean
  hideSearch?: boolean
}

export type ProductsToPrimitivesMap = Record<
  ProductSlug,
  Record<string, ReactNode>
>
