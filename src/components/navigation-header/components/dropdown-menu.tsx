import { Fragment, useMemo, useState } from 'react'
import Link from 'next/link'
import { IconChevronDown16 } from '@hashicorp/flight-icons/svg-react/chevron-down-16'
import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconHome16 } from '@hashicorp/flight-icons/svg-react/home-16'
import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import { IconTools16 } from '@hashicorp/flight-icons/svg-react/tools-16'
import { ProductSlug } from 'types/products'
import ProductIcon from 'components/product-icon'
import Text from 'components/text'
import s from './dropdown-menu.module.css'
import slugify from 'slugify'

const iconNamesToIcons = {
  docs: <IconDocs16 />,
  home: <IconHome16 />,
  terminalScreen: <IconTerminalScreen16 />,
  tools: <IconTools16 />,
}

type NavigationHeaderIcons =
  | ProductSlug
  | 'docs'
  | 'home'
  | 'terminalScreen'
  | 'tools'

interface NavigationHeaderItem {
  icon: NavigationHeaderIcons
  label: string
  path: string
}

interface NavigationHeaderDropdownMenuProps {
  label: string
  itemGroups: NavigationHeaderItem[][]
}

const NavigationHeaderDropdownMenu = ({
  label,
  itemGroups,
}: NavigationHeaderDropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const numberOfItemGroups = itemGroups.length
  const menuId = useMemo(() => `menu-${slugify(label)}`, [label])

  const getItemGroupId = (groupIndex: number): string => {
    return `${menuId}-itemGroup-${groupIndex}`
  }

  const getItemId = (prefix: string, itemIndex: number): string => {
    return `${prefix}-item-${itemIndex}`
  }

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleMouseEnter = () => {
    if (!isOpen) {
      setIsOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (isOpen) {
      setIsOpen(false)
    }
  }

  return (
    <div className={s.root} onMouseLeave={handleMouseLeave}>
      <div className={s.activatorWrapper}>
        <button
          aria-expanded={isOpen}
          className={s.activator}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
        >
          <Text
            asElement="span"
            className={s.activatorText}
            size={200}
            weight="medium"
          >
            {label}
          </Text>
          <IconChevronDown16 className={s.activatorIcon} />
        </button>
      </div>
      <div
        className={s.dropdownContainer}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        {itemGroups.map((items: NavigationHeaderItem[], groupIndex: number) => {
          const groupId = getItemGroupId(groupIndex)
          const isNotLastItemGroup =
            numberOfItemGroups > 1 && groupIndex !== numberOfItemGroups - 1
          return (
            <Fragment key={groupId}>
              {/* eslint-disable-next-line react/no-array-index-key */}
              <ul className={s.itemGroup}>
                {items.map((item: NavigationHeaderItem, itemIndex: number) => {
                  const itemId = getItemId(groupId, itemIndex)
                  const icon = iconNamesToIcons[item.icon] || (
                    <ProductIcon productSlug={item.icon as ProductSlug} />
                  )
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <li className={s.itemContainer} key={itemId}>
                      <Link href={item.path}>
                        <a className={s.itemLink}>
                          {icon}
                          <Text
                            asElement="span"
                            className={s.itemText}
                            size={100}
                            weight="regular"
                          >
                            {item.label}
                          </Text>
                        </a>
                      </Link>
                    </li>
                  )
                })}
              </ul>
              {isNotLastItemGroup && <hr className={s.itemGroupDivider} />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default NavigationHeaderDropdownMenu
