import NavigationHeader from 'components/navigation-header'
import Sidebar, { MenuItem } from 'components/sidebar'
import Sidecar, { SidecarHeading } from 'components/sidecar'
import s from './docs-layout.module.css'

interface DocsLayoutProps {
  children: React.ReactNode
  headings: SidecarHeading[]
  navData: MenuItem[]
}

const DocsLayout: React.FC<DocsLayoutProps> = (props) => (
  <div className={s.container}>
    <NavigationHeader />
    <div className={s.body}>
      <Sidebar menuItems={props.navData} />
      <div className={s.contentWrapper}>
        <div className={s.content}>
          {/* TODO: implement version switcher */}
          {/* <div className={s.versionSwitcher}>VERSION SWITCHER</div> */}
          <main className={s.main}>{props.children}</main>
          <Sidecar headings={props.headings} />
        </div>
      </div>
    </div>
  </div>
)

export default DocsLayout
