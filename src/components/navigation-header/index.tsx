import useCurrentPath from 'hooks/use-current-path'
import HeaderSearchInput from 'components/header-search-input'
import { NavigationHeaderItem } from './types'
import { HomePageHeaderContent, ProductPageHeaderContent } from './components'
import s from './navigation-header.module.css'

/**
 * The header content displayed to the far right of the window. This content is
 * the same for every page in the app.
 *
 * @TODO when we work on adding single-product search for beta, determine if we
 * will be showing `HeaderSearchInput` on the main home page.
 */
const RightSideHeaderContent = () => {
  return (
    <div className={s.rightSide}>
      {__config.flags.enable_product_docs_search ? null : (
        <HeaderSearchInput theme="dark" />
      )}
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
