import { IconCaret16 } from '@hashicorp/flight-icons/svg-react/caret-16'
import ProductIcon from 'components/icons/product-icon'
import s from './style.module.css'

// TODO: make this functional (ref: https://app.asana.com/0/1201010428539925/1201247589988629/f)
const ProductChooser: React.FC = () => (
  <div className={s.productChooser}>
    <div className={s.iconAndNameContainer}>
      <ProductIcon product="vault" />
      <p>Vault</p>
    </div>
    <IconCaret16 />
  </div>
)

export default ProductChooser
