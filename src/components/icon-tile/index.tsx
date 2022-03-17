import classNames from 'classnames'
import { IconTileProps } from './types'
import s from './icon-tile.module.css'

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
