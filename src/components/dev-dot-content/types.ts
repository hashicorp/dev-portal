/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { type ReactNode, type ElementType } from 'react'
import { type MDXRemoteSerializeResult } from 'lib/next-mdx-remote'

type MDXRemoteProps = MDXRemoteSerializeResult & {
	components?: Record<string, ElementType>
	rawContent?: string
}

interface BaseProps {
	className?: string
	onRawContent?: (content: string) => void
}

type WithChildrenOrMdxRemoteProps =
	| {
			children: ReactNode
			mdxRemoteProps?: never
	  }
	| {
			children?: never
			mdxRemoteProps: MDXRemoteProps
	  }

type DevDotContentProps = BaseProps & WithChildrenOrMdxRemoteProps

export type { DevDotContentProps }
