import { NavigationDisclosureLink } from 'components/navigation-disclosure'

const LinkNavigationItem = ({ href, isActive, title }) => {
  // TODO base off of SidebarNavLinkItem
  // TODO use as a container, create shared Content component
  return (
    <NavigationDisclosureLink href={href} isActive={isActive}>
      {title}
    </NavigationDisclosureLink>
  )
}

export default LinkNavigationItem
