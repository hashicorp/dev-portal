/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Link from 'next/link'
import classNames from 'classnames'
import { IconLink16 } from '@hashicorp/flight-icons/svg-react/link-16'
import s from './mdx-heading-permalink.module.css'

interface MdxHeadingPermalinkProps {
	className?: string
	level: 1 | 2 | 3 | 4 | 5 | 6
	href: string
	ariaLabel: string
}

export default function MdxHeadingPermalink({
	className,
	level,
	href,
	ariaLabel,
}: MdxHeadingPermalinkProps) {
	return (
		<Link
			className={classNames(s.root, className, s[`h${level}`])}
			aria-label={ariaLabel}
			href={href}
		>
			<IconLink16 className={s.icon} />
		</Link>
	)
}
