import { ReactElement } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import Card from 'components/card'
import { CardLinkProps } from './types'
import s from './card-link.module.css'

const CardLink = ({
	children,
	className,
	href,
	ariaLabel,
	target,
}: CardLinkProps): ReactElement => {
	const classes = classNames(s.root, className)

	return (
		<Link href={href}>
			<a aria-label={ariaLabel} target={target}>
				<Card className={classes}>{children}</Card>
			</a>
		</Link>
	)
}

export type { CardLinkProps }
export default CardLink
