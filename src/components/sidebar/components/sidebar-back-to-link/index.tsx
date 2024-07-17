/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import { IconChevronLeft16 } from '@hashicorp/flight-icons/svg-react/chevron-left-16'
import StandaloneLink from 'components/standalone-link'
import { SidebarBackToLinkProps } from './types'
import s from './sidebar-back-to-link.module.css'

const SidebarBackToLink = ({
	text,
	href,
}: SidebarBackToLinkProps): ReactElement => {
	return (
		<div className={s.root}>
			<StandaloneLink
				href={href}
				icon={<IconChevronLeft16 className={s.icon} />}
				iconPosition="leading"
				text={text}
			/>
		</div>
	)
}

export type { SidebarBackToLinkProps }
export default SidebarBackToLink
