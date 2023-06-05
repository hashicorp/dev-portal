/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import s from './mdx-blockquote.module.css'

function MdxBlockquote({ className, ...restProps }) {
	return (
		<blockquote
			{...restProps}
			className={classNames(s.blockquote, className)}
		/>
	)
}

export { MdxBlockquote }
