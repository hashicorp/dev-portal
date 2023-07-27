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
import { OpenApiOverviewProps } from './types'
import s from './open-api-overview.module.css'

/**
 * Render an overview section for an OpenApiView.
 *
 * Currently not rendering the overview and form section
 * Until that source content and data is sorted out.
 */
const SHOW_OVERVIEW_AND_FORM = true

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
					{/** TODO plug in with real data */}
					{status ? <Status text={status.text} href={status.href} /> : null}
				</span>
				<Badge
					className={s.releaseStageBadge}
					text={badgeText}
					type="outlined"
					size="small"
				/>
			</header>
			{SHOW_OVERVIEW_AND_FORM ? (
				<section className={s.content}>
					<OverviewBlurb description={description} />
					{/**
					 * TODO Implement this, connect potentially with https://status.hashicorp.com/api
					 * */}
					<div
						style={{ border: '1px solid magenta' }}
						className={s.variablesForm}
					>
						Add your own variables form
					</div>
				</section>
			) : null}
		</div>
	)
}
