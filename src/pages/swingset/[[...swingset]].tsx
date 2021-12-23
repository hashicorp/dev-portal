import createPage from 'swingset/page'
import { createStaticProps, createStaticPaths } from 'swingset/server'
import EmptyLayout from 'layouts/empty'
// additional components
import Search from '@hashicorp/react-search'
import { SearchProvider } from '@hashicorp/react-search'

const components = {
  Search,
  SearchProvider,
}

const SwingsetPage = createPage({ components })
SwingsetPage.layout = EmptyLayout

export const getStaticPaths = createStaticPaths()
export const getStaticProps = createStaticProps()
export default SwingsetPage
