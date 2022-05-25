import { DisclosureContent } from 'components/disclosure'
import { NavigationDisclosureContentProps } from './types'

const NavigationDisclosureContent = ({
  children,
  className,
}: NavigationDisclosureContentProps) => {
  return <DisclosureContent className={className}>{children}</DisclosureContent>
}

export type { NavigationDisclosureContentProps }
export default NavigationDisclosureContent
