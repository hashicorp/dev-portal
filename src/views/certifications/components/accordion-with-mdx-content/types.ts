/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { MDXRemoteSerializeResult } from 'next-mdx-remote-v1'

export interface AccordionMdxItem {
	title: string
	mdxSource: MDXRemoteSerializeResult
}

export interface AccordionWithMdxContentProps {
	items: AccordionMdxItem[]
}
