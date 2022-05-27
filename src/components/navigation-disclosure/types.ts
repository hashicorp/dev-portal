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
}

export type { NavigationDisclosureProps }
