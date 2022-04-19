import { useState } from 'react'
import classNames from 'classnames'
import { IconChevronRight24 } from '@hashicorp/flight-icons/svg-react/chevron-right-24'
import Text from 'components/text'
import { AccordionDisclosureProps } from './types'
import s from './accordion-disclosure.module.css'

const AccordionDisclosure = ({
  children,
  description,
  id,
  open = false,
  title,
}: AccordionDisclosureProps) => {
  const [isOpen, setIsOpen] = useState(open)
  const containerId = `disclosure-${id}`
  const contentContainerId = `${containerId}-content`
  const rootClassnames = classNames(
    s.root,
    s[`root-${isOpen ? 'expanded' : 'collapsed'}`]
  )

  return (
    <div className={rootClassnames} id={containerId}>
      <button
        aria-controls={contentContainerId}
        aria-expanded={isOpen}
        className={s.button}
        onClick={() => setIsOpen((currentIsOpen: boolean) => !currentIsOpen)}
      >
        <span className={s.labelContainer}>
          <Text asElement="span" className={s.title} weight="semibold">
            {title}
          </Text>
          {description && (
            <Text asElement="span" className={s.description} size={200}>
              {title}
            </Text>
          )}
        </span>
        <IconChevronRight24 />
      </button>
      <div className={s.content} id={contentContainerId}>
        {children}
      </div>
    </div>
  )
}

export type { AccordionDisclosureProps }
export default AccordionDisclosure
