import { ReactNode } from 'react'

/**
 * @TODO add iconName prop? (need to look at designs first)
 */
interface NavigationDisclosureLink {
  text: string
  url: string
}

interface NavigationDisclosureProps {
  children: ReactNode
  links: NavigationDisclosureLink[]
}

export type { NavigationDisclosureLink, NavigationDisclosureProps }
