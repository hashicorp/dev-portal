import { ReactElement, useRef, useState } from 'react'
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
import useOnFocusOutside from 'hooks/use-on-focus-outside'

const SidebarSidecarLayout = ({
  breadcrumbLinks,
  children,
  githubFileUrl,
  headings,
  openConsentManager,
  AlternateSidebar,
  sidecarSlot,
  sidebarNavDataLevels,
}: SidebarSidecarLayoutProps) => {
  const { isDesktop } = useDeviceSize()
  const shouldReduceMotion = useReducedMotion()
  const sidebarRef = useRef<HTMLDivElement>()

  /**
   * Sidebar variables.
   */
  const numSidebarLevels = sidebarNavDataLevels.length
  const hasManyLevels = numSidebarLevels > 1
  const [currentSidebarLevel, setCurrentSidebarLevel] = useState(
    numSidebarLevels - 1
  )
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false)
  const sidebarProps = sidebarNavDataLevels[currentSidebarLevel]
  const sidebarIsVisible = isDesktop || sidebarIsOpen
  const shouldRenderMobileControls = !isDesktop && hasManyLevels

  // Handles closing the sidebar if focus moves outside of it and it is open.
  useOnFocusOutside(
    [sidebarRef],
    () => setSidebarIsOpen(false),
    !isDesktop && sidebarIsVisible
  )

  const SidebarContent = (): ReactElement => {
    if (AlternateSidebar && !sidebarProps?.menuItems) {
      return (
        <AlternateSidebar
          {...sidebarProps}
          setCurrentSidebarLevel={setCurrentSidebarLevel}
          shouldRenderMobileControls={shouldRenderMobileControls}
        />
      )
    }

    return (
      <Sidebar
        {...sidebarProps}
        setCurrentSidebarLevel={setCurrentSidebarLevel}
        shouldRenderMobileControls={shouldRenderMobileControls}
      />
    )
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
    <BaseLayout
      showFooter={false}
      sidebarIsOpen={sidebarIsOpen}
      setSidebarIsOpen={setSidebarIsOpen}
    >
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
        <div className={s.mainAreaAndFooter}>
          <div className={s.mainArea}>
            <main id="main" className={s.main}>
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
            <div className={s.sidecar}>
              <SidecarContent />
            </div>
          </div>
          <div className={s.footerArea}>
            <Footer
              className={s.footer}
              openConsentManager={openConsentManager}
            />
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}

export type { SidebarSidecarLayoutProps }
export default SidebarSidecarLayout
