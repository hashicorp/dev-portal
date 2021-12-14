import Link from 'next/link'
import HashiCorpLogo from '@hashicorp/mktg-logos/corporate/hashicorp/logomark/white.svg?include'
import InlineSvg from '@hashicorp/react-inline-svg'
import HeaderSearchInput from 'components/header-search-input'
import ProductChooser from 'components/product-chooser'
// TODO: do we want to add a path alias for config? It currently lives above baseUrl (src)
import { navigationLinks } from '../../../config/main-navigation'
import s from './style.module.css'

/**
 * This is a temporary component. Once all of the nav links point to internal paths,
 * it won't be needed anymore. Not planning to move into a separate file.
 */
const NavLink: React.FC<{
  ariaCurrent: 'page' | undefined
  href: string
  label: string
  path: string
}> = ({ ariaCurrent, href, label, path }) => {
  if (path) {
    return (
      <Link href={path}>
        <a aria-current={ariaCurrent}>{label}</a>
      </Link>
    )
  }

  return (
    <a aria-current={ariaCurrent} href={href}>
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
          {navigationLinks.map((navLink, index) => (
            <li key={navLink.id}>
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
