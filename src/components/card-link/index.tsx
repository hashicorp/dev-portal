import { ReactElement } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import Card from 'components/card'
import { developmentToast, ToastColor } from 'components/toast'
import TruncateMaxLines from 'components/truncate-max-lines'
import { CardLinkProps } from './types'
import s from './card-link.module.css'

const CardLink = ({
	ariaLabel,
	children,
	className,
	description,
	eyebrow,
	footer,
	href,
	logo,
	openInNewTab,
	title,
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

	// TODO fix tab order. Link should come before anything focusable in children.
	// ref: https://app.asana.com/0/1202097197789424/1202822098515463/f

	return (
		<Card className={classes}>
			{/**
			 * "Perhaps the worst thing you can do for a block link is to wrap
			 * everything in the <a href>"
			 *
			 * https://adrianroselli.com/2020/02/block-links-cards-clickable-regions-etc.html
			 */}
			<Link href={href}>
				<a aria-label={ariaLabel} className={s.anchor} target={target}>
					<span className="g-screen-reader-only">{title}</span>
				</a>
			</Link>
			{children ? (
				children
			) : (
				<div className={s.contentWrapper}>
					<div>
						{eyebrow ? <div className={s.eyebrow}>{eyebrow}</div> : null}
						<div className={s.titleAndDescriptionWrapper}>
							{title && !logo ? (
								<div aria-hidden className={s.title}>
									{title}
								</div>
							) : null}
							{logo ? <div className={s.logo}>{logo}</div> : null}
							<div className={s.description}>
								<TruncateMaxLines
									maxLines={3}
									lineHeight="var(--token-typography-body-100-line-height)"
								>
									{description}
								</TruncateMaxLines>
							</div>
						</div>
					</div>
					{footer ? <div className={s.footer}>{footer}</div> : null}
				</div>
			)}
		</Card>
	)
}

export type { CardLinkProps }
export default CardLink
