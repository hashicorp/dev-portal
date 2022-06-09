// Third-party imports
import { ReactElement, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// HashiCorp imports
import { IconInfo16 } from '@hashicorp/flight-icons/svg-react/info-16'

// Global imports
import { getVersionFromPath } from 'lib/get-version-from-path'
import { removeVersionFromPath } from 'lib/remove-version-from-path'
import useOnFocusOutside from 'hooks/use-on-focus-outside'
import { useNoScrollBody } from 'hooks/use-no-scroll-body'
import useCurrentPath from 'hooks/use-current-path'
import { useDeviceSize } from 'contexts'
import BaseLayout from 'layouts/base-new'
import TableOfContents from 'layouts/sidebar-sidecar/components/table-of-contents'
import BreadcrumbBar from 'components/breadcrumb-bar'
import DocsVersionSwitcher from 'components/docs-version-switcher'
import EditOnGithubLink from 'components/edit-on-github-link'
import Footer from 'components/footer'
import InlineLink from 'components/inline-link'
import PageAlert from 'components/page-alert'
import Sidebar from 'components/sidebar'

// Local imports
import { SidebarSidecarLayoutProps } from './types'
import {
  SidebarNavDataProvider,
  useSidebarNavData,
} from './contexts/sidebar-nav-data'
import s from './sidebar-sidecar-layout.module.css'
import AnchorLinkViz from './components/anchor-link-viz'

const SidebarSidecarLayout = (props: SidebarSidecarLayoutProps) => {
  const navDataLevels = props.sidebarNavDataLevels
  return (
    <SidebarNavDataProvider navDataLevels={navDataLevels}>
      <SidebarSidecarLayoutContent {...props} />
    </SidebarNavDataProvider>
  )
}

const SidebarSidecarLayoutContent = ({
  breadcrumbLinks,
  children,
  githubFileUrl,
  headings,
  openConsentManager,
  AlternateSidebar,
  optInOutSlot,
  sidecarSlot,
  sidebarNavDataLevels,
  versions,
}: SidebarSidecarLayoutProps) => {
  const { isDesktop } = useDeviceSize()
  const { currentLevel, sidebarIsOpen, setSidebarIsOpen } = useSidebarNavData()
  const shouldReduceMotion = useReducedMotion()
  const sidebarRef = useRef<HTMLDivElement>()
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const currentlyViewedVersion = getVersionFromPath(currentPath)
  const sidebarProps = sidebarNavDataLevels[currentLevel]
  const sidebarIsVisible = isDesktop || sidebarIsOpen

  // Handles closing the sidebar if focus moves outside of it and it is open.
  useOnFocusOutside(
    [sidebarRef],
    () => setSidebarIsOpen(false),
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

  const sidebarMotion = {
    visible: {
      left: 0,
      display: 'block',
    },
    hidden: {
      left: '-150vw',
      transitionEnd: {
        display: 'none',
      },
    },
  }

  /**
   * Prevents scrolling on the rest of the page body
   */
  useNoScrollBody(sidebarIsOpen)

  return (
    <BaseLayout showFooter={false}>
      <div className={s.root}>
        <motion.div
          animate={sidebarIsVisible ? 'visible' : 'hidden'}
          className={s.sidebarWrapper}
          ref={sidebarRef}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          variants={sidebarMotion}
        >
          <div className={s.sidebarContentWrapper}>
            <SidebarContent />
          </div>
          <div className={s.docsVersionSwitcherWrapper}>
            <DocsVersionSwitcher options={versions} />
          </div>
        </motion.div>
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
              <AnchorLinkViz />
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
          <div className={s.footerAreaWrapper}>
            <Footer
              className={s.footer}
              openConsentManager={openConsentManager}
            />
            <div className={s.emptyDuplicateSidecarWrapper} />
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}

export type { SidebarSidecarLayoutProps }
export default SidebarSidecarLayout
