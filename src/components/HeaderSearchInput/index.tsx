import Icon from 'components/Icon'
import s from './style.module.css'

const HeaderSearchInput: React.FC = () => (
  <div className={s.HeaderSearchInput}>
    <div>
      <Icon className={s.SearchIcon} name="search" />
      <div>Search</div>
    </div>
    <Icon name="slash-square" />
  </div>
)

export default HeaderSearchInput
