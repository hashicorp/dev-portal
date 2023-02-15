/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import { MDXRemote } from 'next-mdx-remote'

type MDXRemoteProps = Parameters<typeof MDXRemote>[0]

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
