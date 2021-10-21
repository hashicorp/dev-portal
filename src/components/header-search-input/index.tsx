import Icon from 'components/icons'
import s from './style.module.css'

const HeaderSearchInput: React.FC = () => (
  <div className={s.headerSearchInput}>
    <div>
      <Icon className={s.searchIcon} name="search" />
      <p>Search</p>
    </div>
    <Icon name="slash-square" />
  </div>
)

export default HeaderSearchInput
