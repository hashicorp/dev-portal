import { ReactNode } from 'react'
import { DisclosureActivatorProps } from 'components/disclosure'

/**
 * @TODO add iconName prop? (need to look at designs first)
 */
interface NavigationDisclosureLink {
  isActive: boolean
  text: string
  url: string
}

interface NavigationDisclosureProps {
  activatorClassName?: DisclosureActivatorProps['className']
  ariaLabel?: DisclosureActivatorProps['ariaLabel']
  children: ReactNode
  links: NavigationDisclosureLink[]
}

export type { NavigationDisclosureLink, NavigationDisclosureProps }
