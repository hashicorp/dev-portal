import { ReactElement } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import Card from 'components/card'
import { developmentToast, ToastColor } from 'components/toast'
import { CardLinkProps } from './types'
import s from './card-link.module.css'

const CardLink = ({
	ariaLabel,
	children,
	className,
	href,
	openInNewTab,
}: CardLinkProps): ReactElement => {
	const classes = classNames(s.root, className)
	const target = openInNewTab ? '_blank' : undefined

	if (!ariaLabel) {
		developmentToast({
			color: ToastColor.critical,
			title: 'Error in CardLink',
			description:
				'`CardLink` requires the `ariaLabel` prop in order to be announced by screen readers.',
		})
	}

	return (
		<Card className={classes}>
			{/**
			 * "Perhaps the worst thing you can do for a block link is to wrap
			 * everything in the <a href>"
			 *
			 * https://adrianroselli.com/2020/02/block-links-cards-clickable-regions-etc.html
			 */}
			<Link href={href}>
				{/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
				<a aria-label={ariaLabel} className={s.anchor} target={target} />
			</Link>
			{children}
		</Card>
	)
}

export type { CardLinkProps }
export default CardLink
