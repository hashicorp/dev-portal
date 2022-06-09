import { HeadingNavigationItemProps } from './components'

interface DividerNavigationItemShape {
  divider: true
}

interface ExpandableNavigationItemShape {
  id: string
  routes: $TSFixMe[]
  title: string
}

interface HeadingNavigationItemShape {
  heading: HeadingNavigationItemProps['text']
  level?: HeadingNavigationItemProps['level']
}

interface LinkNavigationItemShape {
  href?: string
  isActive: boolean
  title: string
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
