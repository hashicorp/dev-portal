import s from './style.module.css'

const Header = () => (
  <header className={s.Header}>
    <nav>
      <div className={s.HeaderLeft}>
        <img src="https://placekitten.com/g/40/40" />
        <div className={s.SiteChooser}>
          <img src="https://placekitten.com/g/16/16" />
          <p>Vault</p>
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
          <img src="https://placekitten.com/g/16/16" />
          <p>Search</p>
        </div>
      </div>
    </nav>
  </header>
)

export default Header
