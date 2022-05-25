import { useState } from 'react'
import classNames from 'classnames'
import { useId } from '@react-aria/utils'
import { DisclosureProps } from './types'
import s from './disclosure.module.css'

const Disclosure = ({
  activatorClassName,
  activatorContent,
  children,
  containerClassName,
  contentContainerClassName,
}: DisclosureProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const uniqueId = `disclosure-${useId()}`
  const contentContainerId = `${uniqueId}-content`

  return (
    <div className={classNames(s.root, containerClassName)}>
      <button
        aria-controls={contentContainerId}
        aria-expanded={isOpen}
        className={classNames(s.activator, activatorClassName)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {activatorContent}
      </button>
      <div
        className={classNames(s.contentContainer, contentContainerClassName)}
        id={contentContainerId}
      >
        {children}
      </div>
    </div>
  )
}

export type { DisclosureProps }
export default Disclosure
