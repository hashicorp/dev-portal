import {
  CSSProperties,
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
} from 'react'

export interface DialogArrowProps {
  /**
   * Whether the arrow should be shown.
   */
  shown: boolean

  /**
   * DOMRect of the target element, for positioning the arrow.
   */
  triggerRect: DOMRect

  /**
   * Minimum distance in pixels that the arrow should be from the viewport edge.
   */
  collisionBuffer: number

  /**
   * Size in pixels of the arrow.
   */
  arrowSize: number

  /**
   * Arrow coloration.
   */
  themeClass: string

  /**
   * An object of style properties.
   */
  themeProps: CSSProperties
}

export interface PopoverProps {
  /**
   * Size in pixels of the arrow.
   */
  arrowSize?: DialogArrowProps['arrowSize']

  /**
   * Elements to render in the content area of the popover.
   */
  children: ReactNode

  /**
   * Minimum distance in pixels that the arrow should be from the viewport edge.
   */
  collisionBuffer?: DialogArrowProps['collisionBuffer']

  /**
   * Option to hide the arrow pointing to the popover's trigger.
   */
  hideArrow?: boolean

  /**
   * Function to set the shown state of the popover. Necessary for close
   * functionality.
   */
  setIsShown: Dispatch<SetStateAction<boolean>>

  /**
   * Whether to show the popover or not.
   */
  shown: boolean

  /**
   * Color scheme appearance of the component. Works best in contexts with a
   * matching theme.
   */
  theme?: 'light' | 'dark'

  /**
   * Optional CSS property override for the component's background color.
   */
  themeBackground?: string

  /**
   * Ref that points to the element that triggered the dialog.
   */
  triggerRef: MutableRefObject<HTMLElement>
}
