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
    // const expandableItem = item as ExpandableNavigationItemShape
    return <ExpandableNavigationItem />
  }

  // TODO pass to component
  // const linkItem = item as LinkNavigationItemShape
  return <LinkNavigationItem />
}

export default NavigationItem
