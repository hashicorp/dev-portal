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
  open = false,
  title,
}) => {
  const [isOpen, setIsOpen] = useState(open)
  const rootClassnames = classNames(
    s.root,
    s[`root-${isOpen ? 'expanded' : 'collapsed'}`]
  )

  return (
    <div className={rootClassnames}>
      <button
        aria-expanded={isOpen}
        className={s.button}
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
      <div className={s.content}>{children}</div>
    </div>
  )
}

export default Disclosure
