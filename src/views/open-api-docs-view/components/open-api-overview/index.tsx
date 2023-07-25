/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconVaultColor16 } from '@hashicorp/flight-icons/svg-react/vault-color-16'
import Link from 'components/link'
import Badge from 'components/badge'
import IconTile from 'components/icon-tile'
import { Status } from './components/status'
import s from './open-api-overview.module.css'

/**
 * Render an overview section for an OpenApiView.
 */

export function OpenApiOverview({ _placeholder }: { _placeholder: $TSFixMe }) {
	console.log(_placeholder)
	return (
		<div>
			<header>
				<IconTile size="medium">
					<IconVaultColor16 />
				</IconTile>
				<h1 className={s.heading}>{_placeholder.schemaData.info.title}</h1>
				<Badge
					className={s.releaseStageBadge}
					text={_placeholder.targetVersion.releaseStage}
					type="outlined"
					size="small"
				/>

				{/** TODO plug in with real data */}
				<Status text="Operational" href="https://google.com" />
			</header>

			<section>
				<div>
					<h2>Overview</h2>
					<p>{_placeholder.schemaData.info.description}</p>
					<h2>Additional Resources</h2>
					<p>
						Use the following resources to give you enough context to be
						successful.
					</p>
					<ul>
						<li>
							<Link href="/vault/tutorials/hcp-vault-secrets-get-started">
								HCP Vault Secrets quick start
							</Link>
						</li>
						<li>
							<Link href="/hcp/docs/vault-secrets/constraints-and-known-issues">
								Constraints and limitations
							</Link>
						</li>
						<li>
							<Link href="/hcp/docs/vault-secrets">
								What is HCP Vault Secrets?
							</Link>
						</li>
					</ul>
				</div>
				<div style={{ border: '1px solid magenta' }}>
					Add your own variables form
				</div>
			</section>
		</div>
	)
}
