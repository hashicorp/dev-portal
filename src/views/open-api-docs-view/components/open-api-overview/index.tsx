/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconCheckCircle16 } from '@hashicorp/flight-icons/svg-react/check-circle-16'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import Link from 'components/link'
import Badge from 'components/badge'

/**
 * Render an overview section for an OpenApiView.
 */
export function OpenApiOverview({ _placeholder }: { _placeholder: $TSFixMe }) {
	console.log(_placeholder)
	return (
		<div>
			<h1>{_placeholder.schemaData.info.title}</h1>
			<Badge
				text={_placeholder.targetVersion.releaseStage}
				type="outlined"
				size="small"
			/>
			<div>
				<Badge
					text="Operational"
					type="outlined"
					color="success"
					size="small"
					icon={<IconCheckCircle16 />}
				/>
				<span>
					<a href="https://google.com">Status</a>
					<IconExternalLink16 />
				</span>
			</div>
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
