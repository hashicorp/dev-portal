/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { IconVaultColor16 } from '@hashicorp/flight-icons/svg-react/vault-color-16'
import Badge from 'components/badge'
import IconTile from 'components/icon-tile'
import OverviewBlurb from './components/overview-blurb'
import { Status } from './components/status'
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
	status?: {
		text: string
		href: string
	}
	className?: string
}

export function OpenApiOverview({
	title,
	badgeText,
	description,
	status,
	className,
}: OpenApiOverviewProps) {
	return (
		<div className={classNames(className, s.overviewWrapper)}>
			<header className={s.header}>
				<IconTile size="medium" className={s.icon}>
					<IconVaultColor16 />
				</IconTile>
				<span>
					<h1 className={s.heading}>{title}</h1>
					{status ? <Status text={status.text} href={status.href} /> : null}
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
