import React, { ReactElement } from 'react'
import Portal from '@reach/portal'
import { useTooltip, TooltipPopup } from '@reach/tooltip'
import classNames from 'classnames'
import { TooltipArrowProps, TooltipProps, PRect } from './types'
import s from './style.module.css'

function Tooltip({
  children,
  label,
  collisionBuffer = 8,
  'aria-label': ariaLabel,
  theme = 'light',
}: TooltipProps): ReactElement {
  const [trigger, tooltip] = useTooltip()
  const { isVisible, triggerRect } = tooltip

  const themeClass = s[`theme-${theme}`]

  return (
    <>
      {typeof children == 'string'
        ? React.createElement('span', trigger, children)
        : React.cloneElement(children, trigger)}
      {isVisible ? (
        <Portal>
          <TooltipArrow
            triggerRect={triggerRect}
            collisionBuffer={collisionBuffer}
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
          centeringFunction(triggerRect, tooltipRect, collisionBuffer)
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
  collisionBuffer: number
) {
  const triggerCenter = triggerRect.left + triggerRect.width / 2
  const left = triggerCenter - tooltipRect.width / 2
  const maxLeft = window.innerWidth - tooltipRect.width - collisionBuffer
  return {
    left: Math.min(Math.max(collisionBuffer, left), maxLeft) + window.scrollX,
    top: triggerRect.bottom + collisionBuffer + window.scrollY,
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
}: TooltipArrowProps) {
  const arrowThickness = 10
  const arrowLeft = triggerRect
    ? `${Math.min(
        // Centered position, covers most use cases
        triggerRect.left - arrowThickness + triggerRect.width / 2,
        // Ensure the arrow is not rendered even partially offscreen,
        // as it will look disconnected from our tooltip body,
        // which must be rendered within the viewport
        window.innerWidth - arrowThickness * 2 - collisionBuffer
      )}px`
    : 'auto'
  const arrowTop = triggerRect
    ? `${triggerRect.bottom + window.scrollY}px`
    : 'auto'

  return (
    <div
      className={classNames(s.arrow, themeClass)}
      style={
        {
          '--left': arrowLeft,
          '--top': arrowTop,
        } as React.CSSProperties
      }
    />
  )
}

export default Tooltip
