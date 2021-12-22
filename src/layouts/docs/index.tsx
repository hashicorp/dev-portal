import NavigationHeader from 'components/navigation-header'
import Sidebar, { MenuItem } from 'components/sidebar'
import Sidecar from 'components/sidecar'
import { SidecarHeading } from 'components/sidecar/types'
import EditOnGithubLink from 'components/edit-on-github-link'
import s from './docs-layout.module.css'

interface DocsLayoutProps {
  children: React.ReactNode
  headings: SidecarHeading[]
  navData: MenuItem[]
  githubFileUrl?: string
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
            {props.children}
            {props.githubFileUrl && (
              <EditOnGithubLink
                url={props.githubFileUrl}
                label="Edit this page on GitHub"
              />
            )}
          </main>
          <Sidecar headings={props.headings} />
        </div>
      </div>
    </div>
  </div>
)

export default DocsLayout
