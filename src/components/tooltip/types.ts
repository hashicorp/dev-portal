import { Position } from '@reach/tooltip'
import { ReactElement, ReactNode } from 'react'
export interface TooltipProps {
  /**
   * Element that, when hovered, will display the tooltip.
   */
  children: ReactElement

  /**
   * Plain text, or `<ReactElement />`, to render in the tooltip.
   */
  label: ReactNode

  /**
   * Optional alternate content for screen readers.
   * Useful if the label prop is not suitable for screen reader announcement,
   * for example for icon-only tooltips.
   */
  ariaLabel?: string

  /**
   * Theme for light or dark mode
   */
  theme?: 'light' | 'dark'
}

/**
 * A partial DOMRect, describe further within @reach/tooltip
 */
export type PRect = Parameters<Position>[0]

export interface TooltipArrowProps {
  /**
   * A partial DOMRect which describes the position of the tooltip trigger.
   * Used to position the tooltip arrow.
   * For use within <Tooltip /> only.
   */
  triggerRect: PRect

  /**
   * The minimum pixel distance to maintain
   * between the tooltip edge and the viewport edge.
   * For use within <Tooltip /> only.
   */
  collisionBuffer: number

  /**
   * A class shared within the component to alter appearance.
   * For use within <Tooltip /> only.
   */
  themeClass: string

  /**
   * The desired width of the tooltip arrow.
   * For use within <Tooltip /> only.
   */
  arrowWidth: number
}
