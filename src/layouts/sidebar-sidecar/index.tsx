import React from 'react'
import BaseNewLayout from 'layouts/base-new'
import Footer from 'components/footer'
import BreadcrumbBar, { BreadcrumbLink } from 'components/breadcrumb-bar'
import EditOnGithubLink from 'components/edit-on-github-link'
import Sidebar, { MenuItem } from 'components/sidebar'
import Sidecar from 'components/sidecar'
import { SidecarHeading } from 'components/sidecar/types'
import s from './sidebar-sidecar-layout.module.css'

interface DocsLayoutProps {
  children: React.ReactNode
  headings: SidecarHeading[]
  navData: MenuItem[]
  productName: string
  breadcrumbLinks?: BreadcrumbLink[]
  githubFileUrl?: string
  openConsentManager?: () => void
  backToLink?: {
    text: string
    url: string
  }
}

const SidebarSidecarLayout: React.FC<DocsLayoutProps> = ({
  productName,
  navData,
  backToLink,
  headings,
  breadcrumbLinks,
  children,
  githubFileUrl,
  openConsentManager,
}) => (
  <BaseNewLayout>
    <div className={s.contentWrapper}>
      <div className={s.sidebar}>
        <Sidebar
          title={productName}
          menuItems={navData}
          backToLink={backToLink}
        />
      </div>
      <div className={s.mainArea}>
        <div className={s.main}>
          {/* TODO: implement version switcher (ref: https://app.asana.com/0/1201010428539925/1201342966970641/f) */}
          {/* <div className={s.versionSwitcher}>VERSION SWITCHER</div> */}
          <main id="main">
            {breadcrumbLinks && <BreadcrumbBar links={breadcrumbLinks} />}
            <div className={s.tempContentStyles}>{children}</div>
            {githubFileUrl && (
              <EditOnGithubLink
                className={s.editOnGithubLink}
                url={githubFileUrl}
                label="Edit this page on GitHub"
              />
            )}
          </main>
          <Footer
            className={s.footer}
            openConsentManager={openConsentManager}
          />
        </div>
        <div className={`${s.sidecar} hide-on-mobile hide-on-tablet`}>
          <Sidecar headings={headings} />
        </div>
      </div>
    </div>
  </BaseNewLayout>
)

export default SidebarSidecarLayout
