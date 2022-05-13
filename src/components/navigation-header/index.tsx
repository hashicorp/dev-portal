import { IconMenu24 } from '@hashicorp/flight-icons/svg-react/menu-24'
import { IconX24 } from '@hashicorp/flight-icons/svg-react/x-24'
import useCurrentPath from 'hooks/use-current-path'
import { useDeviceSize } from 'contexts'
import { NavigationHeaderItem } from './types'
import { HomePageHeaderContent, ProductPageHeaderContent } from './components'
import s from './navigation-header.module.css'

/**
 * The header content displayed to the far right of the window. This content is
 * the same for every page in the app.
 */
const RightSideHeaderContent = ({ sidebarIsOpen, setSidebarIsOpen }) => {
  const ariaLabel = `${sidebarIsOpen ? 'Close' : 'Open'} navigation menu`

  return (
    <div className={s.rightSide}>
      <button
        aria-label={ariaLabel}
        className={s.mobileMenuButton}
        onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
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
const NavigationHeader = ({ sidebarIsOpen, setSidebarIsOpen }) => {
  const { isDesktop } = useDeviceSize()
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const LeftSideHeaderContent =
    currentPath === '/' ? HomePageHeaderContent : ProductPageHeaderContent

  // TODO: menu for the home page, which does not use SidebarSidecarLayout
  const shouldShowRightSide = !isDesktop && currentPath !== '/'

  return (
    <header className={s.root}>
      <LeftSideHeaderContent />
      {shouldShowRightSide && (
        <RightSideHeaderContent
          sidebarIsOpen={sidebarIsOpen}
          setSidebarIsOpen={setSidebarIsOpen}
        />
      )}
    </header>
  )
}

export type { NavigationHeaderItem }
export default NavigationHeader
