import React from 'react'
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
      {children}
      {githubFileUrl && (
        <EditOnGithubLink
          className={s.editOnGithubLink}
          url={githubFileUrl}
          label="Edit this page on GitHub"
        />
      )}
    </main>
  </SidebarSidecarLayout>
)

export default DocsLayout
