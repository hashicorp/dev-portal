/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import InlineAlert from 'components/inline-alert'
import { withErrorBoundary } from 'components/error-boundary'
import { IconInfo24 } from '@hashicorp/flight-icons/svg-react/info-24'
import { IconAlertTriangle24 } from '@hashicorp/flight-icons/svg-react/alert-triangle-24'
import { IconAlertDiamond24 } from '@hashicorp/flight-icons/svg-react/alert-diamond-24'
import { MdxHighlight, MdxTip, MdxNote, MdxWarning } from './variants'
import { MdxInlineAlertData, MdxInlineAlertProps } from './types'
import s from './mdx-inline-alert.module.css'

const ALERT_DATA: MdxInlineAlertData = {
	tip: { title: 'Tip', icon: <IconInfo24 />, color: 'neutral' },
	highlight: { title: 'Tip', icon: <IconInfo24 />, color: 'highlight' },
	note: { title: 'Note', icon: <IconAlertTriangle24 />, color: 'warning' },
	warning: {
		title: 'Warning',
		icon: <IconAlertDiamond24 />,
		color: 'critical',
	},
}

function MdxInlineAlertBase({
	children,
	title,
	type = 'tip',
}: MdxInlineAlertProps) {
	const data = ALERT_DATA[type]

	if (!children) {
		throw new Error(
			'[MdxInlineAlert]: No `children` found, please pass a description body'
		)
	}

	if (!data) {
		throw new Error(
			`[MdxInlineAlert]: Invalid alert type passed, '${type}'. Please pass one of: ${Object.keys(
				ALERT_DATA
			).join(' | ')}`
		)
	}
	return (
		<div className={s.spacing}>
			<InlineAlert
				icon={data.icon}
				title={title ?? data.title}
				description={children}
				color={data.color}
				className={s.typographyOverride}
			/>
		</div>
	)
}

// Create a fallback UI for when the alert component fails
const AlertErrorFallback = (
	<div className={s.spacing}>
		<InlineAlert
			icon={<IconAlertDiamond24 />}
			title="Alert Error"
			description="There was an error rendering this alert. Please check the alert configuration."
			color="critical"
			className={s.typographyOverride}
		/>
	</div>
)

export const MdxInlineAlert = withErrorBoundary(
	MdxInlineAlertBase,
	AlertErrorFallback,
	(error, errorInfo) => {
		if (typeof window !== 'undefined' && window.posthog?.capture) {
			window.posthog.capture('mdx_component_error', {
				component_name: 'MdxInlineAlert',
				error_message: error.message,
				error_stack: error.stack,
				component_stack: errorInfo?.componentStack,
				timestamp: new Date().toISOString(),
				page_url: window.location.href,
			})
		}

		if (process.env.NODE_ENV === 'development') {
			console.warn('MdxInlineAlert validation error:', error.message, errorInfo)
		}
	}
)

export { MdxHighlight, MdxTip, MdxNote, MdxWarning }
