type NativeLIProps = JSX.IntrinsicElements['li']

interface NavigationDisclosureListItemProps {
  /**
   * Content to render within the internally rendered `<li>`.
   */
  children: NativeLIProps['children']

  /**
   * Optional classes to appendto the list of class names passed to the
   * internally rendered `<li>`.
   */
  className?: NativeLIProps['className']
}

export type { NavigationDisclosureListItemProps }
