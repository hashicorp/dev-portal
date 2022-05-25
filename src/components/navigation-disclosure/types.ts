import { ReactNode } from 'react'
import { DisclosureProps } from 'components/disclosure'

/**
 * @TODO add iconName prop? (need to look at designs first)
 */
interface NavigationDisclosureLink {
  text: string
  url: string
}

interface NavigationDisclosureProps {
  ariaLabel?: DisclosureProps['ariaLabel']
  children: ReactNode
  links: NavigationDisclosureLink[]
}

export type { NavigationDisclosureLink, NavigationDisclosureProps }
