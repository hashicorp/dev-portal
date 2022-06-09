import { ReactElement, ReactNode } from 'react'

type NativeULProps = JSX.IntrinsicElements['ul']

interface NavigationDisclosureListProps {
  /**
   * Content to render within the internally rendered `<ul>`.
   */
  children: ReactNode | ReactElement[]

  /**
   * Optional classes to appendto the list of class names passed to the
   * internally rendered `<ul>`.
   */
  className?: NativeULProps['className']
}

export type { NavigationDisclosureListProps }
