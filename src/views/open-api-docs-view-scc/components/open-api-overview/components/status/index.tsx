/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
// Components
import ServiceStatusBadge from 'components/service-status-badge'
import StandaloneLink from 'components/standalone-link'
// Local
import { useServiceStatus } from './utils/use-service-status'
// Types
import { StatusIndicatorConfig } from 'views/open-api-docs-view/types'
// Styles
import s from './status.module.css'

/**
 * Displays a `ServiceStatusBadge` with data from the provided `endpointUrl`,
 * alongside an external link to the provided `pageUrl`.
 *
 * We expect the `endpointUrl` to be a status-page component data URL, like:
 * - https://status.hashicorp.com/api/v2/components/{componentId}.json
 *
 * We expect the `pageUrl` to be a browser-friendly status page URL, such as:
 * - https://status.hashicorp.com
 */
export function Status({ endpointUrl, pageUrl }: StatusIndicatorConfig) {
	const status = useServiceStatus(endpointUrl)
	return (
		<div className={s.wrapper}>
			<ServiceStatusBadge status={status} />
			<StandaloneLink
				text="Status"
				icon={<IconExternalLink16 />}
				iconPosition="trailing"
				color="secondary"
				href={pageUrl}
				size="small"
				opensInNewTab
			/>
		</div>
	)
}
