import createPage from 'swingset/page'
import { createStaticProps, createStaticPaths } from 'swingset/server'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
// additional components
import Search from '@hashicorp/react-search'
import { SearchProvider } from '@hashicorp/react-search'
import InstruqtProvider from 'contexts/instruqt-lab'
import TabProvider from 'components/tabs/provider'
import SwingsetColorToken from '__swingset-components/swingset-color-token'
import SwingsetTestIcon from '__swingset-components/swingset-test-icon'

const components = {
  InstruqtProvider,
  Search,
  SearchProvider,
  TabProvider,
  SwingsetColorToken,
  SwingsetTestIcon,
}

const SwingsetPage = createPage({ components })
SwingsetPage.layout = CoreDevDotLayout

export const getStaticPaths = createStaticPaths()
export const getStaticProps = createStaticProps()
export default SwingsetPage
