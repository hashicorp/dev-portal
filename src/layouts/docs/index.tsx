import BreadcrumbBar, { BreadcrumbLink } from 'components/breadcrumb-bar'
import NavigationHeader from 'components/navigation-header'
import Sidebar, { MenuItem } from 'components/sidebar'
import Sidecar from 'components/sidecar'
import { SidecarHeading } from 'components/sidecar/types'
import s from './docs-layout.module.css'

interface DocsLayoutProps {
  children: React.ReactNode
  headings: SidecarHeading[]
  navData: MenuItem[]
  breadcrumbLinks?: BreadcrumbLink[]
}

const DocsLayout: React.FC<DocsLayoutProps> = (props) => (
  <div className={s.container}>
    <NavigationHeader />
    <div className={s.body}>
      <Sidebar menuItems={props.navData} />
      <div className={s.contentWrapper}>
        <div className={s.content}>
          {/* TODO: implement version switcher (ref: https://app.asana.com/0/1201010428539925/1201342966970641/f) */}
          {/* <div className={s.versionSwitcher}>VERSION SWITCHER</div> */}
          <main className={s.main} id="main">
            {props.breadcrumbLinks ? (
              <BreadcrumbBar links={props.breadcrumbLinks} />
            ) : null}
            {props.children}
          </main>
          <Sidecar headings={props.headings} />
        </div>
      </div>
    </div>
  </div>
)

export default DocsLayout
