import BaseLayout from 'layouts/base-new'
import BreadcrumbBar, { BreadcrumbLink } from 'components/breadcrumb-bar'

export interface TutorialSidebarSidecarProps {
  children: React.ReactNode
  breadcrumbLinks?: BreadcrumbLink[]
}

export default function TutorialSidebarSidecarLayout({
  breadcrumbLinks,
  children,
}: TutorialSidebarSidecarProps) {
  return (
    <BaseLayout>
      <div>Sidebar here</div>
      {breadcrumbLinks && <BreadcrumbBar links={breadcrumbLinks} />}
      <main id="main">{children}</main>
      <div>Sidecar here</div>
    </BaseLayout>
  )
}
