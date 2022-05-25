import classNames from 'classnames'
import { useDisclosure } from 'components/disclosure/provider'
import disclosureStyles from 'components/disclosure/disclosure.module.css'
import { DisclosureActivatorProps } from './types'

/**
 * @TODO document
 */
const DisclosureActivator = ({
  ariaLabel,
  children,
  className,
}: DisclosureActivatorProps) => {
  const { contentContainerId, isOpen, toggleDisclosure } = useDisclosure()

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
