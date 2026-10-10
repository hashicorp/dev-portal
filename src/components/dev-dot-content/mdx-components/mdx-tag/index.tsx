/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { Badge } from '@hashicorp/mds-react/components'
import classNames from 'classnames'
import s from './mdx-tag.module.css'

function MdxTag({ className, text, ...restProps }) {
	return (
		<Badge
			text={text}
			className={classNames(s.badge, className)}
			{...restProps}
		/>
	)
}

export { MdxTag }
