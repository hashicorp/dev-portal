type NativeDivProps = JSX.IntrinsicElements['div']

interface DisclosureContentProps {
  /**
   * The disclosed content.
   */
  children: NativeDivProps['children']

  /**
   * Optional classes to append to the list of class names passed to the
   * containing element.
   */
  className?: NativeDivProps['className']
}

export type { DisclosureContentProps }
