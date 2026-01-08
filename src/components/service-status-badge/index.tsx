/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Badge, type BadgeProps } from '@hashicorp/mds-react/components'

/**
 * Represents status values we expect back from the StatusPage API. Ref:
 * https://developer.statuspage.io/#operation/getPagesPageIdComponentsComponentId
 * (see the `status` value in the `200` response)
 */
type StatusPageStatuses =
	| 'operational'
	| 'degraded_performance'
	| 'partial_outage'
	| 'major_outage'
	| 'under_maintenance'

/**
 * All possible status values this component accepts, which include
 * values returned from StatusPage, as well as 'unknown' and 'loading' states.
 */
export type ServiceStatus = StatusPageStatuses | 'unknown' | 'loading'

/**
 * Maps a service status value to a corresponding badge text, color, and icon.
 *
 * Intent is to try to match StatusPage appearance, while also staying within
 * the bounds of our own badge component. I couldn't find a definitive
 * reference of how each status is shown by StatusPage, but there were clues at:
 * https://support.atlassian.com/statuspage/docs/display-historical-uptime-of-components/
 */
const STATUS_CONTENT_MAP: Record<
	ServiceStatus,
	{ text: string; color: BadgeProps['color']; icon?: BadgeProps['icon'] }
> = {
	operational: {
		text: 'Operational',
		color: 'success',
		icon: 'check-circle',
	},
	degraded_performance: {
		text: 'Degraded',
		color: 'warning',
		icon: 'alert-triangle',
	},
	partial_outage: {
		text: 'Partial Outage',
		color: 'warning',
		icon: 'alert-triangle',
	},
	major_outage: {
		text: 'Major Outage',
		color: 'critical',
		icon: 'x',
	},
	under_maintenance: {
		text: 'Maintenance',
		color: 'highlight',
		icon: 'wrench',
	},
	loading: {
		text: 'Loading…',
		color: 'neutral',
		icon: 'loading',
	},
	unknown: {
		text: 'Unknown',
		color: 'neutral',
		icon: 'help',
	},
}

/**
 * Displays a badge with preset colors and iconography
 * that represent service status values.
 */
function ServiceStatusBadge({ status }: { status: ServiceStatus }) {
	const badgeData = STATUS_CONTENT_MAP[status] ?? STATUS_CONTENT_MAP.unknown
	return (
		<Badge
			text={badgeData.text}
			type="outlined"
			color={badgeData.color}
			size="small"
			icon={badgeData.icon}
		/>
	)
}

export default ServiceStatusBadge
