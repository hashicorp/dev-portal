import { IconSlashSquare16 } from '@hashicorp/flight-icons/svg-react/slash-square-16'
import { IconSearch16 } from '@hashicorp/flight-icons/svg-react/search-16'
import s from './style.module.css'

// TODO: make this functional (ref: https://app.asana.com/0/1201010428539925/1201247589988631/f)
const HeaderSearchInput: React.FC = () => (
  <div className={s.headerSearchInput}>
    <div>
      <IconSearch16 className={s.searchIcon} />
      <p>Search</p>
    </div>
    <IconSlashSquare16 />
  </div>
)

export default HeaderSearchInput
