import { useState } from 'react'
import { IconChevronDown16 } from '@hashicorp/flight-icons/svg-react/chevron-down-16'
import Text from 'components/text'
import s from './dropdown-menu.module.css'

const NavigationHeaderDropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={s.root}>
      <button
        aria-expanded={isOpen}
        className={s.activator}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Text asElement="span" className={s.activatorText}>
          activator text
        </Text>
        <IconChevronDown16 className={s.activatorIcon} />
      </button>
      <ul style={{ display: isOpen ? 'block' : 'none' }}>menu items</ul>
    </div>
  )
}

export default NavigationHeaderDropdownMenu
