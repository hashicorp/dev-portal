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
  /**
   * The goal is to replace `sidebarProps` with `sidebarNavDataLevels`, so this
   * coercion is needed for uses of this layout that do not pass a value for the
   * `sidebarNavDataLevels` prop.
   */
  const navDataLevels = props.sidebarNavDataLevels || [props.sidebarProps]
  return (
    <SidebarNavDataProvider navDataLevels={navDataLevels}>
      <SidebarSidecarLayoutContent
        {...props}
        sidebarNavDataLevels={navDataLevels}
      />
    </SidebarNavDataProvider>
  )
}

const SidebarSidecarLayoutContent = ({
  breadcrumbLinks,
  children,
  githubFileUrl,
  headings,
  openConsentManager,
  sidebarSlot,
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

  /**
   * @TODO the docs Sidebar can have props spread onto it but not all uses of
   * sidebarSlot allow props spreading. The spreading may also become
   * unnecessary once there is a Context that helps manage the current sidebar
   * level and how to change it.
   */
  const SidebarContent = (): ReactElement => {
    if (sidebarSlot) {
      return sidebarSlot
    }

    return <Sidebar {...sidebarProps} />
  }

  const SidecarContent = (): ReactElement => {
    if (sidecarSlot) {
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
          ref={sidebarRef}
          animate={sidebarIsVisible ? 'visible' : 'hidden'}
          variants={sidebarMotion}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          className={s.sidebar}
        >
          <SidebarContent />
        </motion.div>
        <div className={s.mainArea}>
          <div className={s.main}>
            <main id="main">
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
