/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React, { ReactElement } from 'react'
import Portal from '@reach/portal'
import { useTooltip, TooltipPopup } from '@reach/tooltip'
import classNames from 'classnames'
import { TooltipArrowProps, TooltipProps, PRect } from './types'
import s from './style.module.css'

/**
 * OFFSET is the pixel distance to set
 * between the child element's edge and the tooltip edge.
 * Note that the tooltip arrow extends above the tooltip edge.
 */
const SPACE_FROM_CHILDREN = 12

/**
 * ARROW_WIDTH is the width of the tooltip arrow.
 * In an ideal world we might calculate this from the .arrow element size
 * after its 45 degree rotation has been applied, but it's much
 * easier to instead hard-code this value.
 */
const ARROW_WIDTH = 16

/**
 * COLLISION_BUFFER is the minimum pixel distance to maintain
 * between the tooltip edge and the viewport edge.
 */
const COLLISION_BUFFER = 8

function Tooltip({
	children,
	label,
	ariaLabel,
	theme = 'dark',
}: TooltipProps): ReactElement {
	const [trigger, tooltip] = useTooltip()
	const { isVisible, triggerRect } = tooltip

	const themeClass = s[`theme-${theme}`]

	return (
		<>
			{/* Wrapper span acts as trigger */}
			{React.createElement('span', trigger, children)}
			{isVisible ? (
				<Portal>
					<TooltipArrow
						arrowWidth={ARROW_WIDTH}
						triggerRect={triggerRect}
						collisionBuffer={COLLISION_BUFFER}
						themeClass={themeClass}
					/>
				</Portal>
			) : null}
			<TooltipPopup
				{...tooltip}
				isVisible={isVisible}
				className={classNames(s.tooltip, themeClass)}
				label={label}
				aria-label={ariaLabel}
				position={(triggerRect: PRect, tooltipRect: PRect) =>
					centeringFunction(
						triggerRect,
						tooltipRect,
						COLLISION_BUFFER,
						SPACE_FROM_CHILDREN
					)
				}
			/>
		</>
	)
}

/**
 * Given the bounding rectangle for both
 * the tooltip trigger and tooltip popup,
 * render the tooltip centered and below
 * the trigger.
 *
 * Allow viewport collisions to override
 * the centered position where needed,
 * using the collisionBuffer argument
 * to inset the collision area so the tooltip
 * doesn't appear at the very edge of the
 * viewport.
 */
function centeringFunction(
	triggerRect: PRect,
	tooltipRect: PRect,
	collisionBuffer: number,
	spaceFromChildren: number
) {
	const triggerCenter = triggerRect.left + triggerRect.width / 2
	const left = triggerCenter - tooltipRect.width / 2
	const maxLeft = window.innerWidth - tooltipRect.width - collisionBuffer
	return {
		left: Math.min(Math.max(collisionBuffer, left), maxLeft) + window.scrollX,
		top: triggerRect.bottom + spaceFromChildren + window.scrollY,
	}
}

/**
 * Given the bounding rectangle for
 * the tooltip trigger, render a small
 * triangular arrow.
 *
 * This arrow is centered relative to
 * the trigger, but accounts for possible
 * viewport collisions, as we would prefer
 * to have the arrow connected to the popup
 * (which is bound by the viewport) rather
 * than have it perfectly centered but
 * disconnected from the popup.
 */
function TooltipArrow({
	triggerRect,
	collisionBuffer,
	themeClass,
	arrowWidth,
}: TooltipArrowProps) {
	const arrowLeft = triggerRect
		? `${Math.min(
				// Centered position, covers most use cases
				triggerRect.left - arrowWidth / 2 + triggerRect.width / 2,
				// Ensure the arrow is not rendered even partially offscreen,
				// as it will look disconnected from our tooltip body,
				// which must be rendered within the viewport
				window.innerWidth - arrowWidth - collisionBuffer
		  )}px`
		: 'auto'
	const arrowTop = triggerRect
		? `${triggerRect.bottom + window.scrollY + SPACE_FROM_CHILDREN}px`
		: 'auto'

	return (
		<div
			className={classNames(s.arrowContainer, themeClass)}
			style={
				{
					'--left': arrowLeft,
					'--top': arrowTop,
					'--size': arrowWidth + 'px',
				} as React.CSSProperties
			}
		>
			<div className={s.arrow} />
		</div>
	)
}

export default Tooltip
