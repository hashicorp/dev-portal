import { ReactNode } from 'react'

export enum ToastColor {
  neutral = 'neutral',
  highlight = 'highlight',
  success = 'success',
  warning = 'warning',
  critical = 'critical',
}

export interface ToastDisplayProps {
  /**
   * Title
   */
  title?: string
  /**
   * Description
   */
  description?: string
  /**
   * A function called when the close button is clicked.
   */
  onDismiss: () => void
  /**
   * Color for toast. Default to neutral.
   */
  color?: ToastColor
  /**
   * Optional icon
   */
  icon?: ReactNode
  /**
   * Actions
   */
  actions?: ReactNode
  /**
   * Children (for arbitrary content)
   */
  children?: ReactNode
}
