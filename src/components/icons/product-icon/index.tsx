import InlineSvg from '@hashicorp/react-inline-svg'
import { ProductCode } from 'common/types'
import s from './style.module.css'

// TODO: is there a programatic way to build this from productNamesToIcons?
interface ProductIconProps {
  product: ProductCode
}

// TODO: what logos for hcp & sentinel?
const productNamesToIcons: { [key in ProductCode]: any } = {
  boundary: require('@hashicorp/mktg-logos/product/boundary/logomark/color.svg?include'),
  consul: require('@hashicorp/mktg-logos/product/consul/logomark/color.svg?include'),
  hcp: require('@hashicorp/mktg-logos/corporate/hashicorp/logomark/black.svg?include'),
  nomad: require('@hashicorp/mktg-logos/product/nomad/logomark/color.svg?include'),
  packer: require('@hashicorp/mktg-logos/product/packer/logomark/color.svg?include'),
  sentinel: require('@hashicorp/mktg-logos/corporate/hashicorp/logomark/black.svg?include'),
  terraform: require('@hashicorp/mktg-logos/product/terraform/logomark/color.svg?include'),
  vagrant: require('@hashicorp/mktg-logos/product/vagrant/logomark/color.svg?include'),
  vault: require('@hashicorp/mktg-logos/product/vault/logomark/color.svg?include'),
  waypoint: require('@hashicorp/mktg-logos/product/waypoint/logomark/color.svg?include'),
}

const ProductIcon: React.FC<ProductIconProps> = ({ product }) => (
  <InlineSvg className={s.icon} src={productNamesToIcons[product]} />
)

export default ProductIcon
