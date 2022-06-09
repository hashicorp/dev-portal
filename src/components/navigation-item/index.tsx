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
    // TODO pass to component
    const expandableItem = item as ExpandableNavigationItemShape
    return (
      <ExpandableNavigationItem
        id={expandableItem}
        routes={expandableItem.routes}
        title={expandableItem.title}
      />
    )
  }

  // TODO pass to component
  const linkItem = item as LinkNavigationItemShape
  return (
    <LinkNavigationItem
      href={linkItem.href}
      isActive={linkItem.isActive}
      title={linkItem.title}
    />
  )
}

export default NavigationItem
