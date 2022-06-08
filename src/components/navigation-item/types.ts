interface DividerNavigationItemShape {
  divider: true
}

interface ExpandableNavigationItemShape {
  routes: $TSFixMe
}

interface HeadingNavigationItemShape {
  heading: string
  level?: 2 | 3
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
