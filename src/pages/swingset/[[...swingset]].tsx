import createPage from 'swingset/page'
import { createStaticProps, createStaticPaths } from 'swingset/server'

const SwingsetPage = createPage()

SwingsetPage.getLayout = (page: React.ReactElement) => page

export default SwingsetPage

export const getStaticPaths = createStaticPaths()
export const getStaticProps = createStaticProps()
