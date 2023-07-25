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

export function OpenApiOverview({
	_placeholder,
	className,
}: {
	_placeholder: $TSFixMe
	className?: string
}) {
	console.log(_placeholder)
	return (
		<div className={classNames(className, s.overviewWrapper)}>
			<header className={s.header}>
				<IconTile size="medium" className={s.icon}>
					<IconVaultColor16 />
				</IconTile>
				<span>
					<h1 className={s.heading}>{_placeholder.schemaData.info.title}</h1>
					{/** TODO plug in with real data (not sure where we source this) */}
					<Status text="Operational" href="https://google.com" />
				</span>
				<Badge
					className={s.releaseStageBadge}
					text={_placeholder.targetVersion.releaseStage}
					type="outlined"
					size="small"
				/>
			</header>
			<section className={s.content}>
				<div className={s.overviewAndResources}>
					<span>
						<h2 className={s.contentHeading}>Overview</h2>
						<p>{_placeholder.schemaData.info.description}</p>
					</span>
					<span>
						<h2 className={s.contentHeading}>Additional Resources</h2>
						{/** TODO extract out of inline content, where do we want to keep this authorable data? */}
						<p>
							Use the following resources to give you enough context to be
							successful.
						</p>
						<ul className={s.resourceList}>
							<li>
								<InlineLink href="/vault/tutorials/hcp-vault-secrets-get-started">
									HCP Vault Secrets quick start
								</InlineLink>
							</li>
							<li>
								<InlineLink href="/hcp/docs/vault-secrets/constraints-and-known-issues">
									Constraints and limitations
								</InlineLink>
							</li>
							<li>
								<InlineLink href="/hcp/docs/vault-secrets">
									What is HCP Vault Secrets?
								</InlineLink>
							</li>
						</ul>
					</span>
				</div>
				<div
					style={{ border: '1px solid magenta' }}
					className={s.variablesForm}
				>
					Add your own variables form
				</div>
			</section>
		</div>
	)
}
