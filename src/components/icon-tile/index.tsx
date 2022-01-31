import s from './style.module.css'
import classNames from 'classnames'
import { ProductSlug } from 'types/products'

type ProductBrandColor =
  | 'neutral'
  | Exclude<Exclude<ProductSlug, 'sentinel'>, 'hcp'>

interface IconTileProps {
  /** Pass a single child, which should be a Flight icon. For 'small' and 'medium' size, pass the 16px icon size; for other sizes pass the 24px icon size. Note that non-"color" icons will be colored using the "brandColor". */
  children: React.ReactNode
  /** Note: the "extra-large" option is not documented in the design system. It's being used for the IconTileLogo component, as used on the /{product} view pages. */
  size: 'small' | 'medium' | 'large' | 'extra-large'
  /** Optional product slug to use for brand color theming. If not provided, defaults to "neutral". Note that "sentinel" and "hcp" are not supported. */
  brandColor?: ProductBrandColor
}

/**
 * IconTiles are used to represent objects and resources,
 * either unrelated, or directly related to a product.
 *
 * Renders an icon in a brand-colored tile. Note that this IconTile does
 * not fully implement the IconTile component documented in the
 * HashiCorp Design System, as it does not support "secondary" icons.
 *
 * ref: https://www.figma.com/file/noyY6dUMDYjmySpHcMjhkN/HDS-Product---Components-%5BWIP%5D?node-id=1377%3A11992
 */
function IconTile({
  children,
  size = 'medium',
  brandColor = 'neutral',
}: IconTileProps): React.ReactElement {
  return (
    <span
      className={classNames(
        s.root,
        s[`size-${size}`],
        s[`color-${brandColor}`]
      )}
    >
      {children}
    </span>
  )
}

export default IconTile
