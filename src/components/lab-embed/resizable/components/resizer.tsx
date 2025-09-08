/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { MouseEventHandler } from 'react'
import CSS from 'csstype'
import { IconX24 } from '@hashicorp/flight-icons/svg-react/x-24'
// Removing the InlineSvg import which is causing issues in tests
// import InlineSvg from '@hashicorp/react-inline-svg'
// import ResizeBar from './img/resize_bar.svg?include'
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
				onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault()
						// For keyboard activation, trigger mouse down to enable resizing
						if (onMouseDown) {
							const keyboardMouseEvent = {
								preventDefault: () => {},
								stopPropagation: () => {},
								screenY: 0,
								clientY: 0,
								button: 0,
								buttons: 1,
								currentTarget: e.currentTarget,
								target: e.target,
							} as React.MouseEvent<HTMLDivElement>
							onMouseDown(keyboardMouseEvent)
						}
					}
				}}
				role="button"
				aria-label="Resize panel"
				tabIndex={0}
			>
				{/* Replace InlineSvg with direct SVG for testing */}
				<svg
					className={s.resizeBar}
					width="120"
					height="14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect
						width="120"
						height="4"
						rx="2"
						fill="var(--token-color-palette-neutral-300, #c2c5cb)"
					/>
					<rect
						y="10"
						width="120"
						height="4"
						rx="2"
						fill="var(--token-color-palette-neutral-300, #c2c5cb)"
					/>
				</svg>
			</div>
			<button
				className={s.closeIcon}
				onClick={onClosePanel}
				aria-label="Close panel"
			>
				<IconX24 />
			</button>
		</div>
	)
}
