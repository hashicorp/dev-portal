/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import classNames from 'classnames'
import { MDXRemote } from 'lib/next-mdx-remote'
import ImageConfig from 'components/image-config'
import { DevDotContentProps } from './types'
import {
	MdxA,
	MdxOrderedList,
	MdxUnorderedList,
	MdxListItem,
	MdxTab,
	MdxTabs,
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
	MdxTryHcpCallout,
	MdxTip,
	MdxHighlight,
	MdxNote,
	MdxWarning,
	MdxCodeBlockConfig,
	MdxCodeTabs,
	MdxPre,
} from './mdx-components'
import s from './dev-dot-content.module.css'

const DEFAULT_MDX_COMPONENTS = {
	// native html elements
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

	// custom primitives
	CodeBlockConfig: MdxCodeBlockConfig,
	CodeTabs: MdxCodeTabs,
	Highlight: MdxHighlight,
	ImageConfig,
	Note: MdxNote,
	Tab: MdxTab,
	Tabs: MdxTabs,
	Tip: MdxTip,
	TryHcpCallout: MdxTryHcpCallout,
	Warning: MdxWarning,
}

/**
 * Handles providing custom MDX components to MDXRemote. To provide additional
 * components, use the `mdxRemoteProps` .
 *
 * @TODO remove the `children` prop after replacing the 1 instance
 * https://app.asana.com/0/1202097197789424/1203820006759167/f
 */
const DevDotContent = ({
	className,
	children,
	mdxRemoteProps,
}: DevDotContentProps): ReactElement => {
	const shouldRenderChildren = Boolean(children)

	let content
	if (shouldRenderChildren) {
		content = children
	} else {
		content = (
			<MDXRemote
				{...mdxRemoteProps}
				components={{
					...DEFAULT_MDX_COMPONENTS,
					...mdxRemoteProps?.components,
				}}
			/>
		)
	}

	return <div className={classNames(s.root, className)}>{content}</div>
}

export default DevDotContent
