/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import classNames from 'classnames'
// Components
import Link from 'components/link'
import { developmentToast, ToastColor } from 'components/toast'
// Types
import type { LinkRegionProps } from './types'
// Styles
import s from './link-region.module.css'

/**
 * Renders `children` and an adjacent link element in a parent container,
 * with the link element covering the parent container.
 *
 * To adjust the `border-radius` of the focus outline, the incoming
 * `className` can set a `--border-radius` CSS custom property.
 *
 * Note: we could potentially use this component in `CardLink`.
 * For now, didn't want to reach for that abstraction too early.
 * Task: https://app.asana.com/0/1202097197789424/1204909667042721/f
 */
function LinkRegion({
	ariaLabel,
	children,
	className,
	href,
	onClick,
	opensInNewTab,
	'data-heap-track': dataHeapTrack,
}: LinkRegionProps): ReactElement {
	const classes = classNames(s.root, className)
	const target = opensInNewTab ? '_blank' : undefined

	if (!ariaLabel) {
		developmentToast({
			color: ToastColor.critical,
			title: 'Error in LinkRegion',
			description:
				'`LinkRegion` requires the `ariaLabel` prop in order to be announced by screen readers.',
		})
	}

	return (
		<div className={classes}>
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
				data-heap-track={`card-link ${dataHeapTrack ?? ''}`}
				href={href}
				target={target}
				onClick={onClick}
			>
				<span aria-hidden={true}>&nbsp;</span>
			</Link>
			{children}
		</div>
	)
}

export default LinkRegion
