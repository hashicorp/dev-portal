import { HeadingNavigationItemProps } from './components'

interface DividerNavigationItemShape {
  divider: true
}

interface ExpandableNavigationItemShape {
  badge?: $TSFixMe
  leadingIconName?: $TSFixMe
  routes: $TSFixMe
  title: string
}

interface HeadingNavigationItemShape {
  heading: HeadingNavigationItemProps['text']
  level?: HeadingNavigationItemProps['level']
}

interface LinkNavigationItemShape {
  badge?: $TSFixMe
  fullPath?: string
  href?: string
  isActive: boolean
  leadingIconName?: $TSFixMe
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
