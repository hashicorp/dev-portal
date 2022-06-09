import NavigationDisclosure, {
  NavigationDisclosureActivator,
  NavigationDisclosureContent,
  NavigationDisclosureList,
  NavigationDisclosureListItem,
} from 'components/navigation-disclosure'
import LinkNavigationItem from '../link-navigation-item'

const ExpandableNavigationItem = ({
  id,
  title,
  routes,
}): ReturnType<typeof NavigationDisclosure> => {
  // TODO use navigation disclosure component
  // TODO base off of SidebarNavSubmenuItem
  // TODO use as a container, create shared Content component
  return (
    <NavigationDisclosure
      closeOnClickOutside={false}
      closeOnFocusOutside={false}
    >
      <NavigationDisclosureActivator>{title}</NavigationDisclosureActivator>
      <NavigationDisclosureContent>
        <NavigationDisclosureList>
          {routes.map((route: $TSFixMe) => {
            let navigationItem
            if (route.hasOwnProperty('routes')) {
              navigationItem = <ExpandableNavigationItem {...route} />
            } else {
              navigationItem = <LinkNavigationItem {...route} />
            }

            return (
              <NavigationDisclosureListItem key={id}>
                {navigationItem}
              </NavigationDisclosureListItem>
            )
          })}
        </NavigationDisclosureList>
      </NavigationDisclosureContent>
    </NavigationDisclosure>
  )
}

export default ExpandableNavigationItem
