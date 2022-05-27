import { IconMenu24 } from '@hashicorp/flight-icons/svg-react/menu-24'
import { IconX24 } from '@hashicorp/flight-icons/svg-react/x-24'
import { useCurrentProduct, useDeviceSize } from 'contexts'
import { useSidebarNavData } from 'layouts/sidebar-sidecar/contexts/sidebar-nav-data'
import { NavigationHeaderItem } from './types'
import { HomePageHeaderContent, ProductPageHeaderContent } from './components'
import s from './navigation-header.module.css'

/**
 * The header content displayed to the far right of the window. This content is
 * the same for every page in the app.
 */
const RightSideHeaderContent = () => {
  const { sidebarIsOpen, setSidebarIsOpen } = useSidebarNavData()
  const ariaLabel = `${sidebarIsOpen ? 'Close' : 'Open'} navigation menu`

  return (
    <div className={s.rightSide}>
      <button
        aria-label={ariaLabel}
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
  const { isDesktop } = useDeviceSize()
  const currentProduct = useCurrentProduct()
  const LeftSideHeaderContent = currentProduct
    ? ProductPageHeaderContent
    : HomePageHeaderContent

  // TODO: menu for the home page, which does not use SidebarSidecarLayout
  const shouldShowRightSide = !isDesktop && currentProduct

  return (
    <header className={s.root}>
      <LeftSideHeaderContent />
      {shouldShowRightSide && <RightSideHeaderContent />}
    </header>
  )
}

export type { NavigationHeaderItem }
export default NavigationHeader
