import { ReactElement, useEffect, useMemo, useState } from 'react'
import BaseLayout from 'layouts/base-new'
import TableOfContents from 'layouts/sidebar-sidecar/components/table-of-contents'
import BreadcrumbBar from 'components/breadcrumb-bar'
import EditOnGithubLink from 'components/edit-on-github-link'
import Footer from 'components/footer'
import Sidebar, { SidebarProps } from 'components/sidebar'
import { SidebarSidecarLayoutProps } from './types'
import s from './sidebar-sidecar-layout.module.css'
import { useDeviceSize } from 'contexts'

const SidebarSidecarLayout = ({
  breadcrumbLinks,
  children,
  githubFileUrl,
  headings,
  openConsentManager,
  sidebarProps,
  sidebarSlot,
  sidecarSlot,
  sidebarPropsLevels,
}: SidebarSidecarLayoutProps) => {
  const { isDesktop } = useDeviceSize()
  const numSidebarLevels = sidebarPropsLevels ? sidebarPropsLevels.length : 0
  const initialSidebarLevel = numSidebarLevels > 0 ? numSidebarLevels - 1 : 0

  // If `sidebarPropsLevels` is given, set current level to last level.
  const [currentSidebarLevel, setCurrentSidebarLevel] =
    useState<number>(initialSidebarLevel)

  /**
   * @TODO I think this is temporary until all the pages have
   * `sidebarPropsLevels`. Otherwise, when we switch from something like
   * /waypoint to /waypoint/docs, the sidebar level that shows is the first one
   * because this layout component isn't getting re-rendered in a way that
   * re-initializes `currentSidebarLevel`.
   */
  useEffect(() => {
    setCurrentSidebarLevel(initialSidebarLevel)
  }, [initialSidebarLevel])

  /**
   * Initializes sidebarProps based on the current device size, number of
   * sidebar props levels given, and current sidebar level.
   *
   * @TODO we'll probably be able to remove this with the addition of a new
   * Context is a couple of PRs
   */
  const finalSidebarProps: SidebarProps = useMemo(() => {
    // Make backwards compatible with `sidebarProps`
    if (!sidebarPropsLevels) {
      return sidebarProps
    }

    // Copy provided props so we don't modify the original
    const propsCopy = {
      ...sidebarPropsLevels[currentSidebarLevel],
    }

    /**
     * @TODO handle this in Sidebar with a Context in follow-up PRs?
     */
    if (!isDesktop && numSidebarLevels > 1) {
      propsCopy.levelButtonProps.onClick = () => {
        setCurrentSidebarLevel((prevLevel: number) => {
          if (prevLevel === 0) {
            return prevLevel + 1
          } else {
            return prevLevel - 1
          }
        })
      }
    }

    // Return the modified copy of props
    return propsCopy
  }, [
    currentSidebarLevel,
    isDesktop,
    numSidebarLevels,
    sidebarProps,
    sidebarPropsLevels,
  ])

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

    return <Sidebar {...finalSidebarProps} />
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

  return (
    <BaseLayout showFooter={false}>
      <div className={s.contentWrapper}>
        <div className={s.sidebar}>
          <SidebarContent />
        </div>
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
