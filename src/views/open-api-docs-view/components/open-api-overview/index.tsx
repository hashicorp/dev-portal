/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { IconVaultColor16 } from '@hashicorp/flight-icons/svg-react/vault-color-16'
import InlineLink from 'components/inline-link'
import Badge from 'components/badge'
import IconTile from 'components/icon-tile'
import { Status } from './components/status'
import s from './open-api-overview.module.css'

/**
 * Render an overview section for an OpenApiView.
 */
const SHOW_OVERVIEW_AND_FORM = true

interface OpenApiOverviewProps {
	title: string
	badgeText: string
	description: string
	status?: {
		text: string
		href: string
	}
	className?: string
	_placeholder: any
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
					{/**
					 * TODO extract out of inline content, figure out where we want to keep this data
					 * ideally somewhere with the open API data.
					 * */}
					<div className={s.overviewAndResources}>
						<span>
							<h2 className={s.contentHeading}>Overview</h2>
							<p>{description}</p>
						</span>
						<span>
							<h2 className={s.contentHeading}>Additional Resources</h2>
							<p>
								Use the following resources to give you enough context to be
								successful.
							</p>
							<ul className={s.resourceList}>
								<li className={s.resourceLink}>
									<InlineLink
										color="secondary"
										href="/vault/tutorials/hcp-vault-secrets-get-started"
									>
										HCP Vault Secrets quick start
									</InlineLink>
								</li>
								<li className={s.resourceLink}>
									<InlineLink
										color="secondary"
										href="/hcp/docs/vault-secrets/constraints-and-known-issues"
									>
										Constraints and limitations
									</InlineLink>
								</li>
								<li className={s.resourceLink}>
									<InlineLink color="secondary" href="/hcp/docs/vault-secrets">
										What is HCP Vault Secrets?
									</InlineLink>
								</li>
							</ul>
						</span>
					</div>
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
