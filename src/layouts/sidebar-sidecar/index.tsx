// Third-party imports
import { ReactElement, useRef } from 'react'

// HashiCorp imports
import { IconInfo16 } from '@hashicorp/flight-icons/svg-react/info-16'
import { open as openConsentManager } from '@hashicorp/react-consent-manager'

// Global imports
import { getVersionFromPath } from 'lib/get-version-from-path'
import { removeVersionFromPath } from 'lib/remove-version-from-path'
import useOnFocusOutside from 'hooks/use-on-focus-outside'
import useCurrentPath from 'hooks/use-current-path'
import { useDeviceSize, useMobileMenu } from 'contexts'
import BaseLayout from 'layouts/base-new'
import TableOfContents from 'layouts/sidebar-sidecar/components/table-of-contents'
import BreadcrumbBar from 'components/breadcrumb-bar'
import DocsVersionSwitcher from 'components/docs-version-switcher'
import EditOnGithubLink from 'components/edit-on-github-link'
import InlineLink from 'components/inline-link'
import MobileMenuContainer from 'components/mobile-menu-container'
import PageAlert from 'components/page-alert'
import Sidebar from 'components/sidebar'
import Footer from 'components/footer'

// Local imports
import { SidebarSidecarLayoutProps } from './types'
import {
  SidebarNavDataProvider,
  useSidebarNavData,
} from './contexts/sidebar-nav-data'
import s from './sidebar-sidecar-layout.module.css'

const SidebarSidecarLayout = (props: SidebarSidecarLayoutProps) => {
  const navDataLevels = props.sidebarNavDataLevels
  return (
    <BaseLayout showFooterTopBorder>
      <SidebarNavDataProvider navDataLevels={navDataLevels}>
        <SidebarSidecarLayoutContent {...props} />
      </SidebarNavDataProvider>
    </BaseLayout>
  )
}

const SidebarSidecarLayoutContent = ({
  breadcrumbLinks,
  children,
  githubFileUrl,
  headings,
  AlternateSidebar,
  optInOutSlot,
  sidecarSlot,
  sidebarNavDataLevels,
  versions,
}: SidebarSidecarLayoutProps) => {
  const { isDesktop } = useDeviceSize()
  const { mobileMenuIsOpen, setMobileMenuIsOpen } = useMobileMenu()
  const { currentLevel } = useSidebarNavData()
  const sidebarRef = useRef<HTMLDivElement>()
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const currentlyViewedVersion = getVersionFromPath(currentPath)
  const sidebarProps = sidebarNavDataLevels[currentLevel]
  const sidebarIsVisible = isDesktop || mobileMenuIsOpen

  // Handles closing the sidebar if focus moves outside of it and it is open.
  useOnFocusOutside(
    [sidebarRef],
    () => setMobileMenuIsOpen(false),
    !isDesktop && sidebarIsVisible
  )

  const SidebarContent = (): ReactElement => {
    if (AlternateSidebar && !sidebarProps?.menuItems) {
      return <AlternateSidebar {...sidebarProps} />
    }

    return <Sidebar {...sidebarProps} />
  }

  const SidecarContent = (): ReactElement => {
    if (typeof sidecarSlot !== 'undefined') {
      return sidecarSlot
    }

    return (
      <TableOfContents
        headings={headings.filter((heading) => heading.level <= 2)}
      />
    )
  }

  return (
    <div className={s.root}>
      <MobileMenuContainer ref={sidebarRef}>
        <div className={s.sidebarContentWrapper}>
          <SidebarContent />
        </div>
        <div className={s.docsVersionSwitcherWrapper}>
          <DocsVersionSwitcher options={versions} />
        </div>
      </MobileMenuContainer>
      <div className={s.contentWrapper}>
        {currentlyViewedVersion && (
          <PageAlert
            className={s.versionAlert}
            description={
              <>
                You are viewing documentation for version{' '}
                {currentlyViewedVersion}.{' '}
                <InlineLink
                  className={s.versionAlertLink}
                  href={removeVersionFromPath(currentPath)}
                  textSize={200}
                  textWeight="medium"
                >
                  View latest version
                </InlineLink>
                .
              </>
            }
            icon={<IconInfo16 />}
            type="highlight"
          />
        )}
        <div className={s.mainAreaWrapper}>
          <main id="main" className={s.main}>
            <span className={s.breadcrumbOptOutGroup}>
              {breadcrumbLinks && <BreadcrumbBar links={breadcrumbLinks} />}
              <span className={s.optInOutSlot}>
                {optInOutSlot && optInOutSlot}
              </span>
            </span>
            {children}
            {githubFileUrl && (
              <EditOnGithubLink
                className={s.editOnGithubLink}
                url={githubFileUrl}
                label="Edit this page on GitHub"
              />
            )}
          </main>
          <div className={s.sidecarWrapper}>
            <SidecarContent />
          </div>
        </div>
      </div>
    </div>
  )
}

export type { SidebarSidecarLayoutProps }
export default SidebarSidecarLayout
