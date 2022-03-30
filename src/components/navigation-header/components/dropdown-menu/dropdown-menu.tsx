import { useMemo, useState } from 'react'
import Link from 'next/link'
import slugify from 'slugify'
import { IconChevronDown16 } from '@hashicorp/flight-icons/svg-react/chevron-down-16'
import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconHome16 } from '@hashicorp/flight-icons/svg-react/home-16'
import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import { IconTools16 } from '@hashicorp/flight-icons/svg-react/tools-16'
import { ProductSlug } from 'types/products'
import ProductIcon from 'components/product-icon'
import Text from 'components/text'
import {
  NewNavigationHeaderItem as NavigationHeaderItem,
  NavigationHeaderDropdownMenuProps,
} from 'components/navigation-header/types'
import s from './dropdown-menu.module.css'

const supportedIcons = {
  docs: <IconDocs16 />,
  home: <IconHome16 />,
  terminalScreen: <IconTerminalScreen16 />,
  tools: <IconTools16 />,
}

const NavigationHeaderDropdownMenuItem = ({
  item,
}: {
  item: NavigationHeaderItem
}) => {
  const icon = supportedIcons[item.icon] || (
    <ProductIcon productSlug={item.icon as ProductSlug} />
  )

  return (
    <li className={s.itemContainer}>
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
}

const NavigationHeaderDropdownMenuItemGroup = ({
  groupId,
  items,
  showDivider,
}: {
  groupId: string
  items: NavigationHeaderItem[]
  showDivider: boolean
}) => {
  const getItemId = (prefix: string, itemIndex: number): string => {
    return `${prefix}-item-${itemIndex}`
  }

  return (
    <>
      <ul className={s.itemGroup}>
        {items.map((item: NavigationHeaderItem, itemIndex: number) => {
          const itemId = getItemId(groupId, itemIndex)
          return <NavigationHeaderDropdownMenuItem key={itemId} item={item} />
        })}
      </ul>
      {showDivider && <hr className={s.itemGroupDivider} />}
    </>
  )
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

  const ActivatorButton = () => {
    return (
      <button
        aria-controls={menuId}
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
    )
  }

  return (
    <div className={s.root} onMouseLeave={handleMouseLeave}>
      <div className={s.activatorWrapper}>
        <ActivatorButton />
      </div>
      <div
        className={s.dropdownContainer}
        id={menuId}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        {itemGroups.map((items: NavigationHeaderItem[], groupIndex: number) => {
          const groupId = getItemGroupId(groupIndex)
          const showDivider =
            numberOfItemGroups > 1 && groupIndex !== numberOfItemGroups - 1
          return (
            <NavigationHeaderDropdownMenuItemGroup
              groupId={groupId}
              items={items}
              key={groupId}
              showDivider={showDivider}
            />
          )
        })}
      </div>
    </div>
  )
}

export default NavigationHeaderDropdownMenu
