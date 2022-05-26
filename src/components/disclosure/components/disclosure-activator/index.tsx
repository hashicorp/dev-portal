// Third-party imports
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
const DisclosureActivator = ({
  ariaLabel,
  children,
  className,
}: DisclosureActivatorProps) => {
  const { contentContainerId, isOpen, toggleDisclosure } = useDisclosureState()

  return (
    <button
      aria-controls={contentContainerId}
      aria-expanded={isOpen}
      aria-label={ariaLabel}
      className={classNames(disclosureStyles.activator, className)}
      onClick={toggleDisclosure}
    >
      {children}
    </button>
  )
}

export type { DisclosureActivatorProps }
export default DisclosureActivator
