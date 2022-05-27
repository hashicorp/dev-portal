import { forwardRef } from 'react'
import {
  DisclosureActivator,
  DisclosureActivatorForwardedRef,
} from 'components/disclosure'
import { NavigationDisclosureActivatorProps } from './types'

/**
 * Component for rendering the always-visible activator within a
 * `NavigationDisclosure`.
 *
 * @see https://developer.hashi-mktg.com/swingset/components/navigationdisclosure
 *
 * @TODO
 *  - add onKeyDown listener (for `NavigationHeaderDropdownMenu`)
 *  - add onMouseEnter listener (for `NavigationHeaderDropdownMenu`)
 */
// eslint-disable-next-line react/display-name
const NavigationDisclosureActivator = forwardRef(
  (
    { ariaLabel, children, className }: NavigationDisclosureActivatorProps,
    ref: DisclosureActivatorForwardedRef
  ) => {
    return (
      <DisclosureActivator
        ariaLabel={ariaLabel}
        className={className}
        ref={ref}
      >
        {children}
      </DisclosureActivator>
    )
  }
)

export type { NavigationDisclosureActivatorProps }
export default NavigationDisclosureActivator
