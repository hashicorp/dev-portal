/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { type ReactNode, type ElementType } from 'react'
import { type MDXRemoteSerializeResult } from 'next-mdx-remote'

type MDXRemoteProps = MDXRemoteSerializeResult & {
	components?: Record<string, ElementType>
}

interface BaseProps {
	className?: string
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
