import { ReactElement } from 'react'

type NativeDivProps = JSX.IntrinsicElements['div']

interface DisclosureProps {
  /**
   * The content of the Disclosure. Expects one `DisclosureActivator` and then
   * one `DisclosureContent`.
   */
  children: ReactElement[]

  /**
   * Callback function for generating the `className` prop of the containing
   * element. Useful for specifying different class names based on the
   * open/closed state of the `Disclosure`.
   */
  containerClassName?: (isOpen: boolean) => NativeDivProps['className']

  /**
   * Optional boolean that can be used to render the `Disclosure` in the open
   * state on initial load.
   */
  initialOpen?: boolean
}

interface DisclosureContextState {
  closeDisclosure: () => void
  contentContainerId: string
  isOpen: boolean
  openDisclosure: () => void
  toggleDisclosure: () => void
  uniqueId: string
}

export type { DisclosureContextState, DisclosureProps }
