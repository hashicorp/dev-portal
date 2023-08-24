/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
import ProductIcon from 'components/product-icon'
import { ProductSlug } from 'types/products'

/**
 * Render an overview section for an OpenApiView.
 *
 * Status is also optional right now as it is a skateboard
 * component and may be implemented at a later time. Once implemented
 * it should be required.
 */

export interface OpenApiOverviewProps {
	title: string
	schemaIconSlug: ProductSlug
	badgeText: string
	statusIndicatorConfig?: StatusIndicatorConfig
	contentSlot?: ReactNode
	className?: string
}

export function OpenApiOverview({
	title,
	schemaIconSlug,
	badgeText,
	statusIndicatorConfig,
	contentSlot,
}: OpenApiOverviewProps) {
	return (
		<div className={s.overviewWrapper}>
			<header className={s.header}>
				<IconTile size="medium" className={s.icon}>
					<ProductIcon productSlug={schemaIconSlug} />
				</IconTile>
				<span>
					<h1 className={s.heading}>{title}</h1>
					{statusIndicatorConfig ? (
						<Status
							endpointUrl={statusIndicatorConfig.endpointUrl}
							pageUrl={statusIndicatorConfig.pageUrl}
						/>
					) : null}
				</span>
				{badgeText ? (
					<Badge
						className={s.releaseStageBadge}
						text={badgeText}
						type="outlined"
						size="small"
					/>
				) : null}
			</header>
			{contentSlot ? <section>{contentSlot}</section> : null}
		</div>
	)
}
