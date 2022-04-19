import { CSSProperties, useRef } from 'react'
import classNames from 'classnames'
import Portal from '@reach/portal'
import ReachPopover from '@reach/popover'
import { useRect } from '@reach/rect'
import VisuallyHidden from '@reach/visually-hidden'
import InlineSvg from '@hashicorp/react-inline-svg'
import svgX from '@hashicorp/flight-icons/svg/x-24.svg?include'
import useOnClickOutside from 'hooks/use-on-click-outside'
import useOnFocusOutside from 'hooks/use-on-focus-outside'
import { DialogArrowProps, PopoverProps } from './types'
import s from './popover.module.css'

function Popover({
  arrowSize = 10,
  children,
  collisionBuffer = 8,
  hideArrow,
  setIsShown,
  shown,
  theme = 'light',
  themeBackground,
  triggerRef,
}: PopoverProps) {
  const triggerRect = useRect(triggerRef, { observe: true })
  const popoverRef = useRef()

  useOnClickOutside([triggerRef, popoverRef], () => setIsShown(false), shown)
  useOnFocusOutside([popoverRef], () => setIsShown(false), shown)

  const themeClass = s[`theme-${theme}`]
  const themeProps: Record<string, $TSFixMe> = {}
  if (themeBackground) {
    themeProps['--theme-background'] = themeBackground
  }

  return (
    <div>
      {shown ? (
        <>
          <ReachPopover
            targetRef={triggerRef}
            ref={popoverRef}
            position={(targetRef, popoverRect) =>
              centeringFunction(targetRef, popoverRect, collisionBuffer)
            }
            className={classNames(s.popover, themeClass)}
            style={
              {
                '--collision-buffer': collisionBuffer + 'px',
                ...themeProps,
              } as CSSProperties
            }
          >
            <button
              className={classNames(s.dialogClose, themeClass)}
              style={themeProps as CSSProperties}
              onClick={() => setIsShown(false)}
            >
              <VisuallyHidden>Close</VisuallyHidden>
              <InlineSvg src={svgX} aria-hidden />
            </button>
            {children}
          </ReachPopover>
          {!hideArrow && (
            <DialogArrow
              arrowSize={arrowSize}
              collisionBuffer={collisionBuffer}
              shown={true}
              themeClass={themeClass}
              themeProps={themeProps}
              triggerRect={triggerRect}
            />
          )}
        </>
      ) : null}
    </div>
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
  triggerRect: $TSFixMe,
  tooltipRect: $TSFixMe,
  collisionBuffer: $TSFixMe
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
function DialogArrow({
  shown,
  triggerRect,
  collisionBuffer,
  arrowSize,
  themeClass,
  themeProps,
}: DialogArrowProps) {
  if (!shown) {
    return null
  }
  const arrowLeft = triggerRect
    ? `${Math.min(
        // Centered position, covers most use cases
        triggerRect.left - arrowSize + triggerRect.width / 2,
        // Ensure the arrow is not rendered even partially offscreen,
        // as it will look disconnected from our tooltip body,
        // which must be rendered within the viewport
        window.innerWidth - arrowSize * 2 - collisionBuffer
      )}px`
    : 'auto'
  const arrowTop = triggerRect ? `${triggerRect.bottom}px` : 'auto'

  return (
    <Portal>
      <div
        className={classNames(s.dialogArrow, themeClass)}
        style={
          {
            '--left': arrowLeft,
            '--top': arrowTop,
            '--arrow-size': arrowSize + 'px',
            ...themeProps,
          } as CSSProperties
        }
      />
    </Portal>
  )
}

export type { PopoverProps }
export default Popover
