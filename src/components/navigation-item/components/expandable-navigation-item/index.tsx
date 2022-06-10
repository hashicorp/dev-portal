import { KeyboardEventHandler, ReactElement, useRef, useState } from 'react'
import { useId } from '@react-aria/utils'
import Text from 'components/text'
import NavigationItem from 'components/navigation-item'
import { ProductSlug } from 'types/products'
import { IconHome16 } from '@hashicorp/flight-icons/svg-react/home-16'
import Badge from 'components/badge'
import ProductIcon from 'components/product-icon'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'
import s from './expandable-navigation-item.module.css'

const SUPPORTED_LEADING_ICONS: {
  [key in Exclude<SupportedIconName, ProductSlug>]: ReactElement
} = {
  home: <IconHome16 name="home" />,
}

type SupportedIconName = 'home' | ProductSlug

interface ExpandableNavigationItemProps {
  badge?: $TSFixMe
  initialOpen?: boolean
  leadingIconName?: SupportedIconName
  routes: $TSFixMe[]
  title: string
}

// TODO use navigation disclosure component
// TODO base off of SidebarNavSubmenuItem
// TODO use as a container, create shared Content component
const ExpandableNavigationItem = ({
  badge,
  initialOpen = false,
  leadingIconName,
  routes,
  title,
}: ExpandableNavigationItemProps) => {
  const buttonRef = useRef<HTMLButtonElement>()
  const uniqueId = useId()

  const [isOpen, setIsOpen] = useState(initialOpen)
  // const [isOpen, setIsOpen] = useState(
  //   item.hasActiveChild || item.hasChildrenMatchingFilter || item.matchesFilter
  // )

  const hasBadge = Boolean(badge)
  // const hasBadge = !!(item as $TSFixMe).badge

  /**
   * Without this effect, the menu items aren't re-rerendered to be open. Seems
   * to be because the item prop sent to the component don't change. Might work
   * if we pass the props needed instead of just the item object?
   */
  // useEffect(() => {
  //   setIsOpen(
  //     item.hasActiveChild ||
  //       item.hasChildrenMatchingFilter ||
  //       item.matchesFilter
  //   )
  // }, [item.hasActiveChild, item.hasChildrenMatchingFilter, item.matchesFilter])

  const handleKeyDown: KeyboardEventHandler<HTMLUListElement> = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      setIsOpen(false)
      buttonRef.current.focus()
    }
  }

  let leadingIcon
  if (leadingIconName) {
    const icon = SUPPORTED_LEADING_ICONS[leadingIconName] || (
      <ProductIcon productSlug={leadingIconName as ProductSlug} />
    )
    leadingIcon = <div className={s.leadingIcon}>{icon}</div>
  }

  const buttonContent = (
    <div className={s.navigationItemContent}>
      <div className={s.leftSideContent}>
        {leadingIcon}
        <Text
          asElement="span"
          className={s.navigationItemText}
          dangerouslySetInnerHTML={{ __html: title }}
          size={200}
          weight="regular"
        />
      </div>
      <div className={s.rightSideContent}>
        {hasBadge && (
          <Badge
            color={badge.color}
            size="small"
            text={badge.text}
            type={badge.type}
          />
        )}
        {<IconChevronRight16 className={s.trailingIcon} />}
      </div>
    </div>
  )

  return (
    <>
      <button
        aria-controls={uniqueId}
        // aria-controls={item.id}
        aria-expanded={isOpen}
        className={s.root}
        onClick={() => setIsOpen((prevState: boolean) => !prevState)}
        ref={buttonRef}
      >
        {buttonContent}
      </button>
      <ul
        id={uniqueId}
        onKeyDown={handleKeyDown}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        {routes.map((route) => (
          <NavigationItem key={route.id} item={route} />
        ))}
      </ul>
    </>
  )
}

export default ExpandableNavigationItem
