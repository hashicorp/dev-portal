import Icon from 'components/Icon'
import ProductChooser from 'components/ProductChooser'
import s from './style.module.css'

const NavigationHeader: React.FC = () => (
  <header className={s.NavigationHeader}>
    <nav>
      <div className={s.HeaderLeft}>
        <img className={s.SiteLogo} src="https://placekitten.com/g/40/40" />
        <ProductChooser />
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
