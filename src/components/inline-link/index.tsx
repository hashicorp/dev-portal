import { ReactElement } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import { InlineLinkProps } from './types'
import s from './inline-link.module.css'

const IS_DEV = process.env.NODE_ENV !== 'production'

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

	/**
	 * This case is possible for some of the extra <a> elements that are added by
	 * our `anchor-links` remark plugin.
	 *
	 * FUTURE TODOs
	 *   - update the plugin to no longer add empty <a> elements
	 *   - update this to throw an error
	 */
	const hasHref = Boolean(href)
	if (!hasHref) {
		if (IS_DEV) {
			console.error('[InlineLink] a falsy `href` was given. Returning `null`.')
		}

		return null
	}

	return (
		<Link href={href}>
			<a {...rest} className={classes}>
				{children}
			</a>
		</Link>
	)
}

export type { InlineLinkProps }
export default InlineLink
