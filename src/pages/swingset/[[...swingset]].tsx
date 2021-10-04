import createPage from 'swingset/page'
import { createStaticProps, createStaticPaths } from 'swingset/server'

export default createPage()

export const getStaticPaths = createStaticPaths()
export const getStaticProps = createStaticProps()
