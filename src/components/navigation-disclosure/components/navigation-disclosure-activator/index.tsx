import { DisclosureActivator } from 'components/disclosure'
import { NavigationDisclosureActivatorProps } from './types'

const NavigationDisclosureActivator = ({
  ariaLabel,
  children,
  className,
}: NavigationDisclosureActivatorProps) => {
  return (
    <DisclosureActivator ariaLabel={ariaLabel} className={className}>
      {children}
    </DisclosureActivator>
  )
}

export type { NavigationDisclosureActivatorProps }
export default NavigationDisclosureActivator
