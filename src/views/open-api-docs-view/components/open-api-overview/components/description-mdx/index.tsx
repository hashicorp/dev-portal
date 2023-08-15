/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import {
	MdxA,
	MdxOrderedList,
	MdxUnorderedList,
	MdxListItem,
	MdxTable,
	MdxH1,
	MdxH2,
	MdxH3,
	MdxH4,
	MdxH5,
	MdxH6,
	MdxP,
	MdxInlineCode,
	MdxBlockquote,
	MdxPre,
} from 'components/dev-dot-content/mdx-components'
import s from './description-mdx.module.css'

type MdxComponents = Record<string, (props: unknown) => JSX.Element>

const DEFAULT_MDX_COMPONENTS: MdxComponents = {
	a: MdxA,
	blockquote: MdxBlockquote,
	h1: MdxH1,
	h2: MdxH2,
	h3: MdxH3,
	h4: MdxH4,
	h5: MdxH5,
	h6: MdxH6,
	inlineCode: MdxInlineCode,
	li: MdxListItem,
	ol: MdxOrderedList,
	p: MdxP,
	pre: MdxPre,
	table: MdxTable,
	ul: MdxUnorderedList,
}

/**
 * Renders CommonMark-compliant markdown content using our established set
 * of MDX custom components, via next-mdx-remote.
 */
export function DescriptionMdx({
	mdxRemoteProps,
}: {
	mdxRemoteProps: MDXRemoteSerializeResult
}) {
	return (
		<div className={s.root}>
			<MDXRemote
				{...mdxRemoteProps}
				/* The next-mdx-remote types are off here, we're providing a set
				   of functional components that render JSX.Elements, and this works.
					@ts-expect-error */
				components={DEFAULT_MDX_COMPONENTS}
			/>
		</div>
	)
}
