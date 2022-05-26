import Link from 'next/link'
import classNames from 'classnames'
import { useCurrentProduct } from 'contexts'
import InlineLink from 'components/inline-link'
import s from './docs-anchor.module.css'

/** TODO use MDXInlineLink here */

const DocsAnchor = ({
  href,
  children,
  ...rest
}: JSX.IntrinsicElements['a']) => {
  const currentProduct = useCurrentProduct()
  const passableProps = {
    ...rest,
    className: classNames(rest.className, s.anchor),
  }

  if (!href) {
    return <a {...passableProps}>{children}</a>
  }

  // Authors write content as if it only exists for their product,
  // eg Waypoint content contains links that start with "/docs".
  // We need to be adjust these links, eg to start with "/waypoint/docs".
  let adjustedHref = href
  // TODO: infer this condition dynamically
  if (
    currentProduct.basePaths.some((basePath) => href.startsWith(`/${basePath}`))
  ) {
    adjustedHref = `/${currentProduct.slug}${href}`
  }

  // Render inline link if it's for sure a string and not a heading permalink
  if (typeof children === 'string' && children !== '»') {
    return (
      <InlineLink
        href={adjustedHref}
        text={children}
        textSize={300}
        textWeight="medium"
      />
    )
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
