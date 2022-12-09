import { ReactElement, forwardRef, ForwardedRef } from 'react'
import classNames from 'classnames'
import Card from 'components/card'
import Link from 'components/link'
import { developmentToast, ToastColor } from 'components/toast'
import { CardLinkProps } from './types'
import s from './card-link.module.css'

// eslint-disable-next-line react/display-name
const CardLink = forwardRef(
	(
		{
			ariaLabel,
			children,
			className,
			href,
			opensInNewTab,
			'data-heap-track': dataHeapTrack,
		}: CardLinkProps,
		ref: ForwardedRef<HTMLAnchorElement>
	): ReactElement => {
		const classes = classNames(s.root, className)
		const target = opensInNewTab ? '_blank' : undefined

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
				<Link
					aria-label={ariaLabel}
					className={s.anchor}
					data-heap-track={`card-link ${dataHeapTrack ?? ''}`}
					href={href}
					target={target}
					ref={ref}
				/>
				{children}
			</Card>
		)
	}
)

export type { CardLinkProps }
export default CardLink
