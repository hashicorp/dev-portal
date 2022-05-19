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
   * TODO: support actions via children (as in HDS spec)
   */
}
