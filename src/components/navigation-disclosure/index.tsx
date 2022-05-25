import Disclosure from 'components/disclosure'
import Link from 'next/link'
import { NavigationDisclosureLink, NavigationDisclosureProps } from './types'

/**
 * @TODO
 *  - add use of useOnClickOutside ('hooks/use-on-click-outside')
 *  - add use of useOnFocusOutside ('hooks/use-on-focus-outside')
 *
 * Notes for documentation:
 *  - should be rendered inside of a <nav>
 */
const NavigationDisclosure = ({
  activatorClassName,
  ariaLabel,
  children,
  links,
}: NavigationDisclosureProps) => {
  return (
    <Disclosure
      activatorClassName={activatorClassName}
      activatorContent={children}
      ariaLabel={ariaLabel}
    >
      <ul>
        {links.map(({ text, url }: NavigationDisclosureLink) => {
          return (
            <li key={url}>
              <Link href={url}>
                <a>{text}</a>
              </Link>
            </li>
          )
        })}
      </ul>
    </Disclosure>
  )
}

export type { NavigationDisclosureProps }
export default NavigationDisclosure
