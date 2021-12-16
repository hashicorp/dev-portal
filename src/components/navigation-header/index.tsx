import { ReactElement } from 'react'
import Link from 'next/link'
import HashiCorpLogo from '@hashicorp/mktg-logos/corporate/hashicorp/logomark/white.svg?include'
import InlineSvg from '@hashicorp/react-inline-svg'
import HeaderSearchInput from 'components/header-search-input'
import ProductChooser from 'components/product-chooser'
// TODO: we'll need a programatic way to get this data when there are more products
import waypointData from 'data/waypoint.json'
import s from './style.module.css'

/**
 * This is a temporary component. Once all of the nav links point to internal paths,
 * it won't be needed anymore. Not planning to move into a separate file.
 */
const NavLink = ({
  ariaCurrent,
  href,
  label,
  path,
}: {
  ariaCurrent: 'page' | undefined
  href: string
  label: string
  path: string
}): ReactElement => {
  if (path) {
    return (
      <Link href={path}>
        <a aria-current={ariaCurrent} className={s.navLinksAnchor}>
          {label}
        </a>
      </Link>
    )
  }

  return (
    <a aria-current={ariaCurrent} className={s.navLinksAnchor} href={href}>
      {label}
    </a>
  )
}

const NavigationHeader: React.FC = () => (
  <header className={s.navigationHeader}>
    <nav>
      <div className={s.headerLeft}>
        <InlineSvg className={s.siteLogo} src={HashiCorpLogo} />
        <ProductChooser />
      </div>
      <div className={s.headerRight}>
        <ul className={s.navLinks}>
          {waypointData.subnavItems.map((navLink, index) => (
            <li className={s.navLinksListItem} key={navLink.id}>
              {/* TODO: we'll use the router to determine the current link once they're all internal */}
              <NavLink
                ariaCurrent={index === 0 ? 'page' : undefined}
                href={navLink.href}
                label={navLink.label}
                path={navLink.path}
              />
            </li>
          ))}
        </ul>
        <HeaderSearchInput />
      </div>
    </nav>
  </header>
)

export default NavigationHeader
