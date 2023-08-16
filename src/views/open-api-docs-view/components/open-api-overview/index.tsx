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
import OverviewBlurb from './components/overview-blurb'
import { Status } from './components/status'
// Types
import type { StatusIndicatorConfig } from 'views/open-api-docs-view/types'
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
	title: string
	badgeText: string
	description: string
	statusIndicatorConfig?: StatusIndicatorConfig
	className?: string
}

export function OpenApiOverview({
	title,
	badgeText,
	description,
	statusIndicatorConfig,
}: OpenApiOverviewProps) {
	return (
		<div className={s.overviewWrapper}>
			<header className={s.header}>
				<IconTile size="medium" className={s.icon}>
					<IconVaultColor16 />
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
				<Badge
					className={s.releaseStageBadge}
					text={badgeText}
					type="outlined"
					size="small"
				/>
			</header>
			<section className={s.content}>
				<span className={s.contentBlurb}>
					<OverviewBlurb description={description} />
				</span>
			</section>
		</div>
	)
}
