export interface CloseButtonProps {
  /**
   * A function that will be called when the button is clicked.
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  /**
   * Optional class to be added to the button element.
   */
  className?: string
  /**
   * A label that describes the buttons action. Applied as aria-label value.
   */
  ariaLabel: string
}
