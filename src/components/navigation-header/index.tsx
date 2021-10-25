import HashiCorpLogo from '@hashicorp/mktg-logos/corporate/hashicorp/logomark/white.svg?include'
import HeaderSearchInput from 'components/header-search-input'
import InlineSvg from '@hashicorp/react-inline-svg'
import ProductChooser from 'components/product-chooser'
import s from './style.module.css'

const NavigationHeader: React.FC = () => (
  <header className={s.navigationHeader}>
    <nav>
      <div className={s.headerLeft}>
        <InlineSvg className={s.siteLogo} src={HashiCorpLogo} />
        <ProductChooser />
      </div>
      <div className={s.headerRight}>
        {/* TODO: make these links functional (ref: https://app.asana.com/0/1201010428539925/1201247589988627/f) */}
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
