import Link from 'next/link'
import { useRouter } from 'next/router'
import HashiCorpLogo from '@hashicorp/mktg-logos/corporate/hashicorp/logomark/white.svg?include'
import InlineSvg from '@hashicorp/react-inline-svg'
import { useCurrentProduct } from 'contexts'
import HeaderSearchInput from 'components/header-search-input'
import ProductSwitcher from 'components/product-switcher'
import s from './style.module.css'

/**
 * Checks if a header navigation link's path matches the current route's path.
 * Useful for setting the `aria-current` property on <a> elements in the nav,
 * which is used as a CSS selector for applying active styles to links in the
 * header.
 */
const isCurrentPage = (pagePath: string, currentPath: string): boolean => {
  const currentPathSplit = currentPath.split('/')
  const currentProductSlug = currentPathSplit[1]
  const currentProductSubpage = currentPathSplit[2]

  if (currentProductSubpage) {
    return pagePath === `/${currentProductSlug}/${currentProductSubpage}`
  } else if (currentProductSlug) {
    return pagePath === `/${currentProductSlug}`
  } else {
    return pagePath === '/'
  }
}

const NavigationHeader: React.FC = () => {
  const router = useRouter()
  const currentPath = router.asPath
  const currentProduct = useCurrentProduct()

  return (
    <header className={s.navigationHeader}>
      <nav>
        <div className={s.headerLeft}>
          <Link href="/">
            <a>
              <InlineSvg className={s.siteLogo} src={HashiCorpLogo} />
            </a>
          </Link>
          <ProductSwitcher />
        </div>
        {currentProduct?.navigationHeaderItems && (
          <div className={s.headerRight}>
            <ul className={s.navLinks}>
              {currentProduct?.navigationHeaderItems.map((navLink) => {
                const isCurrent = isCurrentPage(navLink.path, currentPath)
                return (
                  <li className={s.navLinksListItem} key={navLink.id}>
                    <Link href={navLink.path}>
                      <a
                        aria-current={isCurrent ? 'page' : undefined}
                        className={s.navLinksAnchor}
                      >
                        {navLink.label}
                      </a>
                    </Link>
                  </li>
                )
              })}
            </ul>
            <HeaderSearchInput theme="dark" />
          </div>
        )}
      </nav>
    </header>
  )
}

export default NavigationHeader
