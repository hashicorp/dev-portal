/* eslint-disable jsx-a11y/anchor-has-content -- We're just passing through props here, so the links should be well formatted */
import { ProductSlug } from 'types/products'
import Link from 'next/link'

export default function makeDocsAnchor(
  product: ProductSlug,
  basePaths: string[]
) {
  const DocsAnchor: React.FC<JSX.IntrinsicElements['a']> = ({
    href,
    ...rest
  }) => {
    if (!href) return <a {...rest} />

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
          <a {...rest} />
        </Link>
      )
    }

    return <a href={adjustedHref} {...rest} />
  }

  return DocsAnchor
}
