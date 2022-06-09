import { HeadingNavigationItemProps } from './components'

interface DividerNavigationItemShape {
  divider: true
}

interface ExpandableNavigationItemShape {
  routes: $TSFixMe
}

interface HeadingNavigationItemShape {
  heading: HeadingNavigationItemProps['text']
  level?: HeadingNavigationItemProps['level']
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

export type {
  DividerNavigationItemShape,
  ExpandableNavigationItemShape,
  HeadingNavigationItemShape,
  LinkNavigationItemShape,
  NavigationItemProps,
}
