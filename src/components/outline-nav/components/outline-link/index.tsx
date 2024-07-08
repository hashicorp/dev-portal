/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import Link from 'components/link'
import type { OutlineLinkProps } from '../../types'
import s from './outline-link.module.css'

/**
 * Renders an individual outline nav link.
 */
function OutlineLink({ title, url, isActive }: OutlineLinkProps) {
	return (
		<Link className={classNames(s.root, { [s.isActive]: isActive })} href={url}>
			{title}
		</Link>
	)
}

export { OutlineLink }
