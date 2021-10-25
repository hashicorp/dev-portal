import InlineSvg from '@hashicorp/react-inline-svg'
import s from '../style.module.css'

interface ProductIconProps {
  product: 'vault'
}

const productNamesToIcons = {
  vault: require('@hashicorp/mktg-logos/product/vault/logomark/white.svg?include'),
}

const ProductIcon: React.FC<ProductIconProps> = ({ product }) => (
  <InlineSvg className={s.icon} src={productNamesToIcons[product]} />
)

export default ProductIcon
