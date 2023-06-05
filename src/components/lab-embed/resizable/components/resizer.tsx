/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { MouseEventHandler } from 'react'
import CSS from 'csstype'
import { IconX24 } from '@hashicorp/flight-icons/svg-react/x-24'
import InlineSvg from '@hashicorp/react-inline-svg'
import ResizeBar from './img/resize_bar.svg?include'
import s from './resizer.module.css'

interface ResizerProps {
	onMouseDown: MouseEventHandler<HTMLDivElement>
	style: CSS.Properties
	onMouseUp?: MouseEventHandler<HTMLDivElement>
	onClosePanel?(): void
}

/**@TODO the resize bar `div` needs a 'role' since its interactive  */

export default function Resizer({
	onMouseDown,
	onMouseUp,
	onClosePanel,
	style = {},
}: ResizerProps) {
	return (
		<div className={s.resizeWrapper} style={style}>
			<div
				className={s.resizer}
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
			>
				<InlineSvg className={s.resizeBar} src={ResizeBar} />
			</div>
			<button className={s.closeIcon} onClick={onClosePanel}>
				<IconX24 />
			</button>
		</div>
	)
}
