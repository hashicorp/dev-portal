import { FC, ReactNode, useState } from 'react'
import classNames from 'classnames'
import { IconChevronRight24 } from '@hashicorp/flight-icons/svg-react/chevron-right-24'
import Text from 'components/text'
import s from './disclosure.module.css'

interface DisclosureProps {
  children: ReactNode
  description?: string
  open?: boolean
  title: string
}

const Disclosure: FC<DisclosureProps> = ({
  children,
  description,
  open,
  title,
}) => {
  const [isOpen, setIsOpen] = useState(open)
  const buttonClassNames = classNames(
    s.button,
    s[`button-${isOpen ? 'expanded' : 'collapsed'}`]
  )

  return (
    <div className={s.root}>
      <button
        aria-expanded={isOpen}
        className={buttonClassNames}
        onClick={() => setIsOpen(!isOpen)}
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
      <div className={s.content} style={{ display: isOpen ? 'block' : 'none' }}>
        {children}
      </div>
    </div>
  )
}

export default Disclosure
