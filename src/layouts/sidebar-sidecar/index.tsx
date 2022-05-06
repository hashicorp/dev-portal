import { ReactElement, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useDeviceSize } from 'contexts'
import BaseLayout from 'layouts/base-new'
import TableOfContents from 'layouts/sidebar-sidecar/components/table-of-contents'
import BreadcrumbBar from 'components/breadcrumb-bar'
import EditOnGithubLink from 'components/edit-on-github-link'
import Footer from 'components/footer'
import Sidebar from 'components/sidebar'
import { SidebarSidecarLayoutProps } from './types'
import s from './sidebar-sidecar-layout.module.css'
import {
  SidebarNavDataProvider,
  useSidebarNavData,
} from './contexts/sidebar-nav-data'
import useOnFocusOutside from 'hooks/use-on-focus-outside'

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

  return (
    <BaseLayout showFooter={false}>
      <div className={s.contentWrapper}>
        <motion.div
          animate={sidebarIsVisible ? 'visible' : 'hidden'}
          className={s.sidebar}
          ref={sidebarRef}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          variants={sidebarMotion}
        >
          <SidebarContent />
        </motion.div>
        <div className={s.mainArea}>
          <div className={s.main}>
            <main id="main">
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
            <Footer
              className={s.footer}
              openConsentManager={openConsentManager}
            />
          </div>
          <div className={`${s.sidecar} g-hide-on-mobile g-hide-on-tablet`}>
            <SidecarContent />
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}

export type { SidebarSidecarLayoutProps }
export default SidebarSidecarLayout
