/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import classNames from 'classnames'
import Card from 'components/card'
import Link from 'components/link'
import { developmentToast, ToastColor } from 'components/toast'
import { CardLinkProps } from './types'
import s from './card-link.module.css'

const CardLink = ({
	ariaLabel,
	children,
	className,
	href,
	onClick,
	opensInNewTab,
}: CardLinkProps): ReactElement => {
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
			 *
			 * Re: `span` with &nbsp; — Safari will only focus on links
			 * that have content. This markup allows focus to behave as
			 * expected while retaining the desired sibling
			 * 'empty link' structure
			 */}
			<Link
				aria-label={ariaLabel}
				className={s.anchor}
				href={href}
				target={target}
				onClick={onClick}
			>
				<span aria-hidden={true}>&nbsp;</span>
			</Link>
			{children}
		</Card>
	)
}

export type { CardLinkProps }
export default CardLink
