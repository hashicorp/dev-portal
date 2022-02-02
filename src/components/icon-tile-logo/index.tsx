import ProductIcon from 'components/product-icon'
import IconTile from 'components/icon-tile'
import { IconTileLogoProps } from './type'

/**
 * Use the IconTileLogo component when representing the product in our interfaces.
 *
 * Renders a product icon in a brand-colored tile. Note that this IconTileLogo
 * is currently styled to match dev-portal designs, and differs in size and
 * background coloration from the IconTileLogo documented in the
 * HashiCorp Design System.
 *
 * ref: https://www.figma.com/file/noyY6dUMDYjmySpHcMjhkN/HDS-Product---Components-%5BWIP%5D?node-id=1377%3A11992
 */
function IconTileLogo({ product }: IconTileLogoProps): React.ReactElement {
  return (
    <IconTile
      size="extra-large"
      brandColor={product == 'hcp' ? 'neutral' : product}
    >
      <ProductIcon product={product} />
    </IconTile>
  )
}

export default IconTileLogo
