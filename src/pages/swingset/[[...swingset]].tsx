import createPage from 'swingset/page'
import { createStaticProps, createStaticPaths } from 'swingset/server'
import EmptyLayout from 'layouts/empty'

const SwingsetPage = createPage()

SwingsetPage.layout = EmptyLayout

export default SwingsetPage

export const getStaticPaths = createStaticPaths()
export const getStaticProps = createStaticProps()
