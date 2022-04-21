import { IconMenu24 } from '@hashicorp/flight-icons/svg-react/menu-24'
import { IconX24 } from '@hashicorp/flight-icons/svg-react/x-24'
import useCurrentPath from 'hooks/use-current-path'
import { useDeviceSize } from 'contexts'
import { useSidebarNavData } from 'layouts/sidebar-sidecar/contexts/sidebar-nav-data'
import { NavigationHeaderItem } from './types'
import { HomePageHeaderContent, ProductPageHeaderContent } from './components'
import s from './navigation-header.module.css'

/**
 * The header content displayed to the far right of the window. This content is
 * the same for every page in the app.
 */
const RightSideHeaderContent = () => {
  const { isDesktop } = useDeviceSize()
  const { sidebarIsOpen, setSidebarIsOpen } = useSidebarNavData()

  if (isDesktop) {
    return null
  }

  return (
    <div className={s.rightSide}>
      <button
        className={s.mobileMenuButton}
        onClick={() => setSidebarIsOpen((prevState) => !prevState)}
      >
        {sidebarIsOpen ? <IconX24 /> : <IconMenu24 />}
      </button>
    </div>
  )
}

/**
 * The main navigation header for all DevDot pages. Renders two different
 * styles: one for the main home page, and one for all routes under
 * `/{productSlug}.`
 */
const NavigationHeader = () => {
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const LeftSideHeaderContent =
    currentPath === '/' ? HomePageHeaderContent : ProductPageHeaderContent

  return (
    <header className={s.root}>
      <LeftSideHeaderContent />
      <RightSideHeaderContent />
    </header>
  )
}

export type { NavigationHeaderItem }
export default NavigationHeader
