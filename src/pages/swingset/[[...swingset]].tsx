import createPage from 'swingset/page'
import { createStaticProps, createStaticPaths } from 'swingset/server'
import EmptyLayout from 'layouts/empty'
// additional components
import Search from '@hashicorp/react-search'
import { SearchProvider } from '@hashicorp/react-search'
import SwingsetColorToken from '__swingset-components/swingset-color-token'
import SwingsetTestIcon from '__swingset-components/swingset-test-icon'

const components = {
  Search,
  SearchProvider,
  SwingsetColorToken,
  SwingsetTestIcon,
}

const SwingsetPage = createPage({ components })
SwingsetPage.layout = EmptyLayout

export const getStaticPaths = createStaticPaths()
export const getStaticProps = createStaticProps()
export default SwingsetPage
