import NavigationHeader from 'components/navigation-header'
import Sidebar, { MenuItem } from 'components/sidebar'
import s from './docs-layout.module.css'

interface DocsLayoutProps {
  children: React.ReactNode
  navData: MenuItem[]
}

const DocsLayout: React.FC<DocsLayoutProps> = (props) => (
  <div className={s.container}>
    <NavigationHeader />
    <div className={s.body}>
      <Sidebar menuItems={props.navData} />
      <div className={s.contentWrapper}>
        <div className={s.content}>
          {/* <div className={s.versionSwitcher}>VERSION SWITCHER</div> */}
          <main className={s.main}>{props.children}</main>
          <aside className={s.tableOfContents}>
            <p className={s.tableOfContentsLabel}>Table of Contents</p>
            <ul className={s.tableOfContentsList}>
              <li className={s.tableOfContentsListItem}>Introduction</li>
              <li className={s.tableOfContentsListItem}>Vault Documentation</li>
              <li className={s.tableOfContentsListItem}>Quickstart</li>
              <li className={s.tableOfContentsListItem}>Use cases</li>
              <li className={s.tableOfContentsListItem}>Learning</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  </div>
)

export default DocsLayout
