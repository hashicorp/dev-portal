import { IconMenu24 } from '@hashicorp/flight-icons/svg-react/menu-24'
import { IconX24 } from '@hashicorp/flight-icons/svg-react/x-24'
import { useCurrentProduct, useDeviceSize, useMobileMenu } from 'contexts'
import { NavigationHeaderItem } from './types'
import {
  GiveFeedbackButton,
  HomePageHeaderContent,
  ProductPageHeaderContent,
} from './components'
import s from './navigation-header.module.css'

/**
 * The header content displayed to the far right of the window. This content is
 * the same for every page in the app.
 */
const SidebarMenuButton = () => {
  const { mobileMenuIsOpen, setMobileMenuIsOpen } = useMobileMenu()
  const ariaLabel = `${mobileMenuIsOpen ? 'Close' : 'Open'} navigation menu`

  return (
    <>
      <button
        aria-label={ariaLabel}
        className={s.mobileMenuButton}
        onClick={() => setMobileMenuIsOpen((prevState) => !prevState)}
      >
        {mobileMenuIsOpen ? <IconX24 /> : <IconMenu24 />}
      </button>
    </>
  )
}

/**
 * The main navigation header for all DevDot pages. Renders two different
 * styles: one for the main home page, and one for all routes under
 * `/{productSlug}.`
 */
const NavigationHeader = () => {
  const currentProduct = useCurrentProduct()
  const LeftSideHeaderContent = currentProduct
    ? ProductPageHeaderContent
    : HomePageHeaderContent

  return (
    <header className={s.root}>
      <LeftSideHeaderContent />
      <div className={s.rightSide}>
        <GiveFeedbackButton />
        <SidebarMenuButton />
      </div>
    </header>
  )
}

export type { NavigationHeaderItem }
export default NavigationHeader
