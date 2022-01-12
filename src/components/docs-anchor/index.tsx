import Link from 'next/link'
import classNames from 'classnames'
import { useCurrentProduct } from 'contexts'
import s from './style.module.css'

const DocsAnchor: React.FC<JSX.IntrinsicElements['a']> = ({
  href,
  children,
  ...rest
}) => {
  const currentProduct = useCurrentProduct()

  const passableProps = {
    ...rest,
    className: classNames(rest.className, s.anchor),
  }

  if (!href) return <a {...passableProps}>{children}</a>

  let adjustedHref = href
  // TODO: infer this condition dynamically
  if (
    currentProduct.basePaths.some((basePath) => href.startsWith(`/${basePath}`))
  ) {
    adjustedHref = `/${currentProduct.slug}${href}`
  }

  // Render a next/link to avoid a full reload if we know for sure the link is an internal docs link.
  // TODO: This heuristic can likely be tweaked to be more inclusive of other internal links
  if (adjustedHref !== href) {
    return (
      <Link href={adjustedHref}>
        <a {...passableProps}>{children}</a>
      </Link>
    )
  }

  return (
    <a href={adjustedHref} {...passableProps}>
      {children}
    </a>
  )
}

export default DocsAnchor
