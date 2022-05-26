// Third-party imports
import { forwardRef, ForwardedRef } from 'react'
import classNames from 'classnames'

// Global imports
import { useDisclosureState } from 'components/disclosure'
import disclosureStyles from 'components/disclosure/disclosure.module.css'

// Local imports
import { DisclosureActivatorProps } from './types'

/**
 * Component for rendering the always-visible activator within a `Disclosure`.
 *
 * @see https://developer.hashi-mktg.com/swingset/components/disclosure
 */
// eslint-disable-next-line react/display-name
const DisclosureActivator = forwardRef(
  (
    { ariaLabel, children, className }: DisclosureActivatorProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const { contentContainerId, isOpen, toggleDisclosure } =
      useDisclosureState()

    return (
      <button
        aria-controls={contentContainerId}
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={classNames(disclosureStyles.activator, className)}
        onClick={toggleDisclosure}
        ref={ref}
      >
        {children}
      </button>
    )
  }
)

export type { DisclosureActivatorProps }
export default DisclosureActivator
