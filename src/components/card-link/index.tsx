/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import classNames from 'classnames'
import LinkRegion from '@components/link-region'
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
	const classes = classNames(s.root, className, 'hds-surface-mid')

	return (
		<LinkRegion
			ariaLabel={ariaLabel}
			className={classes}
			href={href}
			onClick={onClick}
			opensInNewTab={opensInNewTab}
		>
			{children}
		</LinkRegion>
	)
}

export type { CardLinkProps }
export default CardLink
