import { Position } from '@reach/tooltip'
import { ReactElement, ReactNode } from 'react'

export type PRect = Parameters<Position>[0]

export interface TooltipProps {
  /** Element that, when hovered, will display the tooltip. */
  children: ReactElement
  /** Plain text, or render slot, to render in the tooltip */
  label: ReactNode
  /** Optional alternate content for screen readers.
   * Useful if the label prop is not suitable for screen reader announcement. */
  ariaLabel?: string
  /** Minimum spacing from viewport edge */
  collisionBuffer?: number
  /** Theme for light or dark mode */
  theme?: 'light' | 'dark'
  /** Optional CSS override for background color. Foreground color can be overridden by passing a styled React node to the label prop.  */
  themeBackground?: string
}

export interface TooltipArrowProps {
  triggerRect: PRect
  collisionBuffer: number
  themeClass: string
  arrowWidth: number
}
