import Icon from 'components/icons'
import ProductIcon from 'components/icons/product-icon'
import s from './style.module.css'

const ProductChooser: React.FC = () => (
  <div className={s.productChooser}>
    <div className={s.iconAndNameContainer}>
      <ProductIcon product="vault" />
      <p>Vault</p>
    </div>
    <Icon name="caret" />
  </div>
)

export default ProductChooser
