import Link from 'next/link'
import useCurrentPath from 'hooks/use-current-path'
import { useCurrentProduct } from 'contexts'
import Text from 'components/text'
import s from './primary-nav-link.module.css'

interface PrimaryNavLinkProps {
  ariaLabel: string
  navItem: {
    id?: string
    isSubmenu?: boolean
    label: string
    pathSuffix?: string
  }
}

const PrimaryNavLink = ({ ariaLabel, navItem }: PrimaryNavLinkProps) => {
  const { label, pathSuffix } = navItem
  const currentProduct = useCurrentProduct()
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const linkHref = `/${currentProduct.slug}/${pathSuffix}`
  const isCurrentPage =
    linkHref === currentPath || linkHref === `${currentPath}/`

  return (
    <Link href={linkHref}>
      <a
        aria-current={isCurrentPage ? 'page' : undefined}
        aria-label={ariaLabel}
        className={s.root}
      >
        <Text
          asElement="span"
          className={s.linkText}
          size={200}
          weight="medium"
        >
          {label}
        </Text>
      </a>
    </Link>
  )
}

export default PrimaryNavLink
