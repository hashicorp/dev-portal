import BaseLayout from 'layouts/base-new'
import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import TableOfContents from 'layouts/sidebar-sidecar/components/table-of-contents'
import BreadcrumbBar from 'components/breadcrumb-bar'
import React from 'react'

export type TutorialSidebarSidecarProps = Pick<
  SidebarSidecarLayoutProps,
  'children' | 'headings' | 'breadcrumbLinks'
>

export default function TutorialSidebarSidecarLayout({
  headings,
  breadcrumbLinks,
  children,
}: TutorialSidebarSidecarProps): React.ReactElement {
  return (
    <BaseLayout>
      <div>Sidebar here</div>
      {breadcrumbLinks && <BreadcrumbBar links={breadcrumbLinks} />}
      <main id="main">{children}</main>
      <TableOfContents headings={headings} />
    </BaseLayout>
  )
}
