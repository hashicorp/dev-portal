/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party
import { IconVaultColor16 } from '@hashicorp/flight-icons/svg-react/vault-color-16'
// Components
import Badge from 'components/badge'
import IconTile from 'components/icon-tile'
// Local
import { Status } from './components/status'
// Types
import type { StatusIndicatorConfig } from 'views/open-api-docs-view/types'
// Types
import type { ReactNode } from 'react'
// Styles
import s from './open-api-overview.module.css'

/**
 * Render an overview section for an OpenApiView.
 *
 * Status is also optional right now as it is a skateboard
 * component and may be implemented at a later time. Once implemented
 * it should be required.
 */

export interface OpenApiOverviewProps {
	heading: {
		text: string
		slug: string
	}
	badgeText: string
	statusIndicatorConfig?: StatusIndicatorConfig
	contentSlot?: ReactNode
	className?: string
}

export function OpenApiOverview({
	heading,
	badgeText,
	statusIndicatorConfig,
	contentSlot,
}: OpenApiOverviewProps) {
	return (
		<div className={s.overviewWrapper}>
			<header className={s.header}>
				<IconTile size="medium" className={s.icon}>
					<IconVaultColor16 />
				</IconTile>
				<span>
					<h1 id={heading.slug} className={s.heading}>
						{heading.text}
					</h1>
					{statusIndicatorConfig ? (
						<Status
							endpointUrl={statusIndicatorConfig.endpointUrl}
							pageUrl={statusIndicatorConfig.pageUrl}
						/>
					) : null}
				</span>
				<Badge
					className={s.releaseStageBadge}
					text={badgeText}
					type="outlined"
					size="small"
				/>
			</header>
			{contentSlot ? <section>{contentSlot}</section> : null}
		</div>
	)
}
