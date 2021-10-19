import Icon from 'components/Icon'
import s from './style.module.css'

const NavigationHeader: React.FC = () => (
  <header className={s.NavigationHeader}>
    <nav>
      <div className={s.HeaderLeft}>
        <img src="https://placekitten.com/g/40/40" />
        <div className={s.SiteChooser}>
          <img src="https://placekitten.com/g/16/16" />
          <p>Vault</p>
          <Icon name="caret" />
        </div>
      </div>
      <div className={s.HeaderRight}>
        <ul className={s.NavLinks}>
          <li>
            <a>Reference Docs</a>
          </li>
          <li>
            <a>CLI</a>
          </li>
          <li>
            <a>API</a>
          </li>
          <li>
            <a>Downloads</a>
          </li>
        </ul>
        <div className={s.SearchInput}>
          <Icon name="search" />
          <p>Search</p>
          <Icon name="slash-square" />
        </div>
      </div>
    </nav>
  </header>
)

export default NavigationHeader
