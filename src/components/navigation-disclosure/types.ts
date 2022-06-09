import { DisclosureProps } from 'components/disclosure'

interface NavigationDisclosureProps {
  /**
   * The content of the `NavigationDisclosure`. Expects one
   * `NavigationDisclosureActivator` and then one `NavigationDisclosureContent`.
   */
  children: DisclosureProps['children']

  /**
   * Optional className to pass to the inner rendered `Disclosure`.
   */
  className?: DisclosureProps['containerClassName']

  /**
   * Whether or not the `useOnClickOutside` hook should be enabled. Is not
   * enabled by default.
   */
  closeOnClickOutside?: DisclosureProps['closeOnClickOutside']

  /**
   * Whether or not the `useOnFocusOutside` hook should be enabled. Is not
   * enabled by default.
   */
  closeOnFocusOutside?: DisclosureProps['closeOnFocusOutside']
}

export type { NavigationDisclosureProps }
