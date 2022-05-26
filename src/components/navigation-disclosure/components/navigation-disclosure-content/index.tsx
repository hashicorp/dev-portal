import { DisclosureContent } from 'components/disclosure'
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
  return <DisclosureContent className={className}>{children}</DisclosureContent>
}

export type { NavigationDisclosureContentProps }
export default NavigationDisclosureContent
