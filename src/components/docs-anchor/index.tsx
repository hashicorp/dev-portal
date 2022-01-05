import { ProductSlug } from 'types/products'
import Link from 'next/link'
import classNames from 'classnames'
import s from './style.module.css'

export default function makeDocsAnchor(
  product: ProductSlug,
  basePaths: string[]
) {
  const DocsAnchor: React.FC<JSX.IntrinsicElements['a']> = ({
    href,
    children,
    ...rest
  }) => {
    const passableProps = {
      ...rest,
      className: classNames(rest.className, s.anchor),
    }

    if (!href) return <a {...passableProps}>{children}</a>

    let adjustedHref = href
    // TODO: infer this condition dynamically
    if (basePaths.some((basePath) => href.startsWith(`/${basePath}`))) {
      // TODO: infer the product dynamically
      adjustedHref = `/${product}${href}`
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

  return DocsAnchor
}
