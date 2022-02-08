import React, { useMemo } from 'react'
import BreadcrumbBar, { BreadcrumbLink } from 'components/breadcrumb-bar'
import EditOnGithubLink from 'components/edit-on-github-link'
import Footer from 'components/footer'
import Sidebar, { MenuItem } from 'components/sidebar'
import SidebarSidecarLayout from './partials/sidebar-sidecar-layout'
import TableOfContents, {
  TableOfContentsHeading,
} from 'components/table-of-contents'
import s from './docs-layout.module.css'

interface DocsLayoutProps {
  children: React.ReactNode
  headings: TableOfContentsHeading[]
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
}) => {
  const level1And2Headings = useMemo(
    () => headings.filter((heading) => heading.level <= 2),
    [headings]
  )

  return (
    <SidebarSidecarLayout
      sidebar={
        <Sidebar
          title={productName}
          menuItems={navData}
          backToLink={backToLink}
        />
      }
      sidecar={<TableOfContents headings={level1And2Headings} />}
    >
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
      <Footer className={s.footer} openConsentManager={openConsentManager} />
    </SidebarSidecarLayout>
  )
}

export default DocsLayout
