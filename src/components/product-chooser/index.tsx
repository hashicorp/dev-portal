import Icon from 'components/icon'
import s from './style.module.css'

const ProductChooser: React.FC = () => (
  <div className={s.productChooser}>
    <div>
      <img src="https://placekitten.com/g/16/16" />
      <div>Vault</div>
    </div>
    <Icon name="caret" />
  </div>
)

export default ProductChooser
