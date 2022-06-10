import { KeyboardEventHandler, useRef, useState } from 'react'
import { useId } from '@react-aria/utils'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'
import NavigationItem from 'components/navigation-item'
import NavigationItemContent, {
  NavigationItemContentProps,
} from '../navigation-item-content'
import s from './expandable-navigation-item.module.css'

interface ExpandableNavigationItemProps {
  badge?: $TSFixMe
  initialOpen?: boolean
  leadingIconName?: NavigationItemContentProps['leadingIconName']
  routes: $TSFixMe[]
  title: string
}

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

  const buttonContent = (
    <NavigationItemContent
      badge={badge}
      leadingIconName={leadingIconName}
      text={title}
      trailingIcon={<IconChevronRight16 className={s.trailingIcon} />}
    />
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
