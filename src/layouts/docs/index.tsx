import React from 'react'
import Footer from 'components/footer'
import BreadcrumbBar, { BreadcrumbLink } from 'components/breadcrumb-bar'
import Sidebar, { MenuItem } from 'components/sidebar'
import Sidecar from 'components/sidecar'
import { SidecarHeading } from 'components/sidecar/types'
import EditOnGithubLink from 'components/edit-on-github-link'
import BaseNewLayout from 'layouts/base-new'
import s from './docs-layout.module.css'

interface DocsLayoutProps {
  children: React.ReactNode
  headings: SidecarHeading[]
  navData: MenuItem[]
  breadcrumbLinks?: BreadcrumbLink[]
  githubFileUrl?: string
  openConsentManager?: () => void
  backToLink?: {
    text: string
    url: string
  }
}

const DocsLayout: React.FC<DocsLayoutProps> = (props) => (
  <BaseNewLayout>
    <div className={s.body}>
      <Sidebar menuItems={props.navData} backToLink={props.backToLink} />
      <div className={s.contentWrapper}>
        <div className={s.content}>
          {/* TODO: implement version switcher (ref: https://app.asana.com/0/1201010428539925/1201342966970641/f) */}
          {/* <div className={s.versionSwitcher}>VERSION SWITCHER</div> */}
          <main className={s.main} id="main">
            {props.breadcrumbLinks && (
              <BreadcrumbBar links={props.breadcrumbLinks} />
            )}
            {props.children}
            {props.githubFileUrl && (
              <EditOnGithubLink
                className={s.editOnGithubLink}
                url={props.githubFileUrl}
                label="Edit this page on GitHub"
              />
            )}
            <Footer
              className={s.footer}
              openConsentManager={props.openConsentManager}
            />
          </main>
          <Sidecar headings={props.headings} />
        </div>
      </div>
    </div>
  </BaseNewLayout>
)

export default DocsLayout
