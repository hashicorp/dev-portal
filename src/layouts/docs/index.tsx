import React from 'react'
import Footer from 'components/footer'
import BreadcrumbBar, { BreadcrumbLink } from 'components/breadcrumb-bar'
import Sidebar, { MenuItem } from 'components/sidebar'
import Sidecar from 'components/sidecar'
import { SidecarHeading } from 'components/sidecar/types'
import EditOnGithubLink from 'components/edit-on-github-link'
import SidebarSidecarLayout from './partials/sidebar-sidecar-layout'
import s from './docs-layout.module.css'

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

const DocsLayout: React.FC<DocsLayoutProps> = ({
  productName,
  navData,
  backToLink,
  headings,
  breadcrumbLinks,
  children,
  githubFileUrl,
  openConsentManager,
}) => (
  <SidebarSidecarLayout
    sidebar={
      <Sidebar
        title={productName}
        menuItems={navData}
        backToLink={backToLink}
      />
    }
    sidecar={<Sidecar headings={headings} />}
  >
    {/* TODO: implement version switcher (ref: https://app.asana.com/0/1201010428539925/1201342966970641/f) */}
    {/* <div className={s.versionSwitcher}>VERSION SWITCHER</div> */}
    <main className={s.main} id="main">
      {breadcrumbLinks && <BreadcrumbBar links={breadcrumbLinks} />}
      <div className={s.tempContentStyles}>{children}</div>
      {githubFileUrl && (
        <EditOnGithubLink
          className={s.editOnGithubLink}
          url={githubFileUrl}
          label="Edit this page on GitHub"
        />
      )}
       <Footer
              className={s.footer}
              openConsentManager={props.openConsentManager}
            />
    </main>
  </SidebarSidecarLayout>
)

export default DocsLayout
