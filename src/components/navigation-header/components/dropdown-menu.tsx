import { useState } from 'react'
import { IconChevronDown16 } from '@hashicorp/flight-icons/svg-react/chevron-down-16'
import Text from 'components/text'
import s from './dropdown-menu.module.css'

const NavigationHeaderDropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={s.root}>
      <div className={s.activatorWrapper}>
        <button
          aria-expanded={isOpen}
          className={s.activator}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Text
            asElement="span"
            className={s.activatorText}
            size={200}
            weight="medium"
          >
            Documentation
          </Text>
          <IconChevronDown16 className={s.activatorIcon} />
        </button>
      </div>
      <ul
        className={s.dropdownList}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        TODO: menu items
      </ul>
    </div>
  )
}

export default NavigationHeaderDropdownMenu
