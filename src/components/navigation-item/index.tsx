import {
  DividerNavigationItem,
  ExpandableNavigationItem,
  HeadingNavigationItem,
  LinkNavigationItem,
} from './components'

interface DividerNavigationItemShape {
  divider: true
}

interface HeadingNavigationItemShape {
  heading: string
  level?: 2 | 3
}

interface ExpandableNavigationItemShape {
  routes: $TSFixMe
}

interface LinkNavigationItemShape {
  href?: string
}

interface NavigationItemProps {
  item:
    | DividerNavigationItemShape
    | HeadingNavigationItemShape
    | ExpandableNavigationItemShape
    | LinkNavigationItemShape
}

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
