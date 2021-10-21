import HeaderSearchInput from 'components/header-search-input'
import ProductChooser from 'components/product-chooser'
import s from './style.module.css'

const NavigationHeader: React.FC = () => (
  <header className={s.navigationHeader}>
    <nav>
      <div className={s.headerLeft}>
        <img className={s.siteLogo} src="https://placekitten.com/g/40/40" />
        <ProductChooser />
      </div>
      <div className={s.headerRight}>
        <ul className={s.navLinks}>
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
        <HeaderSearchInput />
      </div>
    </nav>
  </header>
)

export default NavigationHeader
