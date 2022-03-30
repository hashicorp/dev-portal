import createPage from 'swingset/page'
import { createStaticProps, createStaticPaths } from 'swingset/server'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
// additional components
import Search from '@hashicorp/react-search'
import { SearchProvider } from '@hashicorp/react-search'
import SwingsetColorToken from '__swingset-components/swingset-color-token'
import SwingsetTestIcon from '__swingset-components/swingset-test-icon'

// TODO: temporary for building new navigation menus
import { NavigationHeaderDropdownMenu } from 'components/navigation-header/components'

const components = {
  Search,
  SearchProvider,
  SwingsetColorToken,
  SwingsetTestIcon,
  NavigationHeaderDropdownMenu,
}

const SwingsetPage = createPage({ components })
SwingsetPage.layout = CoreDevDotLayout

export const getStaticPaths = createStaticPaths()
export const getStaticProps = createStaticProps()
export default SwingsetPage
