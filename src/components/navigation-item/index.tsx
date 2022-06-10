import {
  ExpandableNavigationItemShape,
  HeadingNavigationItemShape,
  LinkNavigationItemShape,
  NavigationItemProps,
} from './types'
import {
  DividerNavigationItem,
  ExpandableNavigationItem,
  HeadingNavigationItem,
  LinkNavigationItem,
} from './components'

const NavigationItem = ({ item }: NavigationItemProps) => {
  if (item.hasOwnProperty('divider')) {
    return <DividerNavigationItem />
  }

  if (item.hasOwnProperty('heading')) {
    const headingItem = item as HeadingNavigationItemShape
    return (
      <HeadingNavigationItem
        level={headingItem.level}
        text={headingItem.heading}
      />
    )
  }

  if (item.hasOwnProperty('routes')) {
    const expandableItem = item as ExpandableNavigationItemShape
    return (
      <ExpandableNavigationItem
        badge={expandableItem.badge}
        leadingIconName={expandableItem.leadingIconName}
        routes={expandableItem.routes}
        title={expandableItem.title}
      />
    )
  }

  const linkItem = item as LinkNavigationItemShape
  return (
    <LinkNavigationItem
      badge={linkItem.badge}
      href={linkItem.fullPath || linkItem.href}
      isActive={linkItem.isActive}
      leadingIconName={linkItem.leadingIconName}
      title={linkItem.title}
    />
  )
}

export default NavigationItem
