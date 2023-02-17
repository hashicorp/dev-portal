/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import InlineAlert from 'components/inline-alert'
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

export function MdxInlineAlert({
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

export { MdxHighlight, MdxTip, MdxNote, MdxWarning }
