import Icon from 'components/Icon'
import s from './style.module.css'

const ProductChooser: React.FC = () => (
  <div className={s.ProductChooser}>
    <div>
      <img src="https://placekitten.com/g/16/16" />
      <span>Vault</span>
    </div>
    <Icon name="caret" />
  </div>
)

export default ProductChooser
