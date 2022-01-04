import React from 'react'
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
  backToLink?: {
    text: string
    url: string
  }
}

const DocsLayout: React.FC<DocsLayoutProps> = (props) => {
  /**
   * TODO: these will be different by product, can abstract these into separate
   * config files after some discussion. Placing here because we need these
   * links everywhere the sidebar shows.
   */
  const fullNavData = [
    ...props.navData,
    { divider: true },
    {
      title: 'HashiCorp Learn',
      href: 'https://learn.hashicorp.com/waypoint',
    },
    {
      title: 'Community Forum',
      href: 'https://discuss.hashicorp.com/c/waypoint/51',
    },
    {
      title: 'Support',
      href: 'https://support.hashicorp.com/',
    },
  ]

  return (
    <BaseNewLayout>
      <div className={s.body}>
        <Sidebar menuItems={fullNavData} backToLink={props.backToLink} />
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
            </main>
            <Sidecar headings={props.headings} />
          </div>
        </div>
      </div>
    </BaseNewLayout>
  )
}

export default DocsLayout
