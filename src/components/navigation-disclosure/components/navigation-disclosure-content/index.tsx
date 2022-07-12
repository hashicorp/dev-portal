import { DisclosureContent } from 'components/disclosure'
import { validateNavigationDisclosureContentChildren } from 'components/navigation-disclosure/helpers'
import { NavigationDisclosureContentProps } from './types'

/**
 * Component for rendering content within a `NavigationDisclosure`.
 *
 * @see https://developer.hashi-mktg.com/swingset/components/navigationdisclosure
 */
const NavigationDisclosureContent = ({
  children,
  className,
}: NavigationDisclosureContentProps) => {
  validateNavigationDisclosureContentChildren(children)

  return <DisclosureContent className={className}>{children}</DisclosureContent>
}

export type { NavigationDisclosureContentProps }
export default NavigationDisclosureContent
