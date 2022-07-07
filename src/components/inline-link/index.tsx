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

	/**
	 * An undefined "href" is possible for some of the extra "target" <a> elements
	 * that are added by our `anchor-links` remark plugin. These elements have
	 * an "id", and act as a target for anchor links, but do not have an href.
	 *
	 * For now, we still want to render these elements, as they're needed
	 * for some anchor links to function.
	 *
	 * FUTURE TODOs
	 *   - update the plugin to no longer add empty <a> elements
	 *   - update this to throw an error if href is falsy
	 *
	 * Asana task:
	 * https://app.asana.com/0/1100423001970639/1202488740132127/f
	 */
	const hrefWithFallback = href || '#'

	return (
		<Link href={hrefWithFallback}>
			<a {...rest} className={classes}>
				{children}
			</a>
		</Link>
	)
}

export type { InlineLinkProps }
export default InlineLink
