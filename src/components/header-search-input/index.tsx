import Icon from 'components/icons'
import s from './style.module.css'

// TODO: make this functional (ref: https://app.asana.com/0/1201010428539925/1201247589988631/f)
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
