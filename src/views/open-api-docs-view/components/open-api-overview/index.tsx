/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { IconVaultColor16 } from '@hashicorp/flight-icons/svg-react/vault-color-16'
import Badge from 'components/badge'
import IconTile from 'components/icon-tile'
import OverviewBlurb from './components/overview-blurb'
import VariablesForm from './components/variables-form'
import { Status } from './components/status'
import { OpenApiOverviewProps } from './types'
import s from './open-api-overview.module.css'

/**
 * Render an overview section for an OpenApiView.
 *
 * Currently rendering the overview and form section for testing purposes
 * But set up the conditional rendering in case we want to hide it
 * and release without this section.
 *
 * Status is also optional right now as it is a skateboard
 * component and may be implemented at a later time. Once implemented
 * it should be required.
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
					<span className={s.contentBlurb}>
						<OverviewBlurb description={description} />
					</span>
					<span className={s.variablesForm}>
						<VariablesForm />
					</span>
				</section>
			) : null}
		</div>
	)
}
