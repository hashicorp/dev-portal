import { ReactElement, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import useOnFocusOutside from 'hooks/use-on-focus-outside'
import { useNoScrollBody } from 'hooks/use-no-scroll-body'
import { useDeviceSize } from 'contexts'
import BaseLayout from 'layouts/base-new'
import TableOfContents from 'layouts/sidebar-sidecar/components/table-of-contents'
import BreadcrumbBar from 'components/breadcrumb-bar'
import EditOnGithubLink from 'components/edit-on-github-link'
import Footer from 'components/footer'
import Sidebar from 'components/sidebar'
import DocsVersionSwitcher from 'components/docs-version-switcher'
import { SidebarSidecarLayoutProps } from './types'
import {
  SidebarNavDataProvider,
  useSidebarNavData,
} from './contexts/sidebar-nav-data'
import s from './sidebar-sidecar-layout.module.css'

const SidebarSidecarLayout = (props: SidebarSidecarLayoutProps) => {
  const navDataLevels = props.sidebarNavDataLevels
  return (
    <SidebarNavDataProvider navDataLevels={navDataLevels}>
      <SidebarSidecarLayoutContent {...props} />
    </SidebarNavDataProvider>
  )
}

const SidebarSidecarLayoutContent = ({
  AlternateSidebar,
  breadcrumbLinks,
  children,
  githubFileUrl,
  headings,
  openConsentManager,
  optInOutSlot,
  sidebarNavDataLevels,
  sidecarSlot,
  versions,
}: SidebarSidecarLayoutProps) => {
  const { isDesktop } = useDeviceSize()
  const { currentLevel, sidebarIsOpen, setSidebarIsOpen } = useSidebarNavData()
  const shouldReduceMotion = useReducedMotion()
  const sidebarRef = useRef<HTMLDivElement>()
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
          <div className={s.mainAreaWrapper}>
            <main id="main" className={s.main}>
              <span className={s.breadcrumbOptOutGroup}>
                {breadcrumbLinks && <BreadcrumbBar links={breadcrumbLinks} />}
                {optInOutSlot && optInOutSlot}
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
