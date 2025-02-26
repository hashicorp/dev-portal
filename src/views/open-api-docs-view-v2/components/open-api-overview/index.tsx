/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Components
import Badge from 'components/badge'
import IconTile from 'components/icon-tile'
import ProductIcon from 'components/product-icon'
// Local
import { Status } from '../landing-content/components/status'
// Types
import type { StatusIndicatorConfig } from 'views/open-api-docs-view/types'
import type { ReactNode } from 'react'
import type { ProductSlug } from 'types/products'
// Styles
import s from './open-api-overview.module.css'

export interface OpenApiOverviewProps {
	heading: {
		text: string
		id: string
	}
	badgeText: string
	serviceProductSlug: ProductSlug
	statusIndicatorConfig?: StatusIndicatorConfig
	contentSlot?: ReactNode
	versionSwitcherSlot?: ReactNode
	className?: string
}

/**
 * Render an overview section for an Open API landing view.
 */
export function OpenApiOverview({
	heading,
	badgeText,
	serviceProductSlug,
	statusIndicatorConfig,
	contentSlot,
	versionSwitcherSlot,
}: OpenApiOverviewProps) {
	return (
		<div className={s.overviewWrapper}>
			<div className={s.headerAndVersionSwitcher}>
				<header className={s.header}>
					<IconTile size="medium" className={s.icon}>
						<ProductIcon productSlug={serviceProductSlug} />
					</IconTile>
					<span>
						<h1 id={heading.id} className={s.heading}>
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
				{versionSwitcherSlot ? (
					<div className={s.versionSwitcherSlot}>{versionSwitcherSlot}</div>
				) : null}
			</div>
			{contentSlot ? <section>{contentSlot}</section> : null}
		</div>
	)
}
