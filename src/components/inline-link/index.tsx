import { ReactElement } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import { InlineLinkProps } from './types'
import s from './inline-link.module.css'

const InlineLink = ({
	children,
	className,
	href,
	textSize = 300,
	textWeight = 'regular',
	...rest
}: InlineLinkProps): ReactElement => {
	const classes = classNames(
		s.root,
		`hds-typography-body-${textSize}`,
		`hds-font-weight-${textWeight}`,
		className
	)

	return (
		<Link href={href} {...rest} className={classes}>
			{children}
		</Link>
	)
}

export type { InlineLinkProps }
export default InlineLink
