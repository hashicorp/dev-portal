/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { MDXRemoteSerializeResult } from 'lib/next-mdx-remote'

export interface AccordionMdxItem {
	title: string
	mdxSource: MDXRemoteSerializeResult
}

export interface AccordionWithMdxContentProps {
	items: AccordionMdxItem[]
}
