import React from 'react'
import BaseLayout from 'layouts/base-new'
import BreadcrumbBar from 'components/breadcrumb-bar'
import EditOnGithubLink from 'components/edit-on-github-link'
import Footer from 'components/footer'
import Sidebar from 'components/sidebar'
import TableOfContents from 'layouts/sidebar-sidecar/components/table-of-contents'
import { SidebarSidecarLayoutProps } from './types'
import s from './sidebar-sidecar-layout.module.css'

const SidebarSidecarLayout: React.FC<SidebarSidecarLayoutProps> = ({
  breadcrumbLinks,
  children,
  githubFileUrl,
  headings,
  openConsentManager,
  sidebarProps,
  sidecarSlot,
}) => (
  <BaseLayout showFooter={false}>
    <div className={s.contentWrapper}>
      <div className={s.sidebar}>
        <Sidebar
          backToLinkProps={sidebarProps.backToLinkProps}
          menuItems={sidebarProps.menuItems}
          showFilterInput={sidebarProps.showFilterInput}
          title={sidebarProps.title}
        />
      </div>
      <div className={s.mainArea}>
        <div className={s.main}>
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
        <div className={`${s.sidecar} g-hide-on-mobile g-hide-on-tablet`}>
          {sidecarSlot ? (
            sidecarSlot
          ) : (
            <TableOfContents
              headings={headings.filter((heading) => heading.level <= 2)}
            />
          )}
        </div>
      </div>
    </div>
  </BaseLayout>
)

export type { SidebarSidecarLayoutProps }
export default SidebarSidecarLayout
