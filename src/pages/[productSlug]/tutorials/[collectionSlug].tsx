import CollectionView from 'views/collection-view'
import { generateStaticFunctions } from 'views/collection-view/server'

const { getStaticProps, getStaticPaths } = generateStaticFunctions()

export { getStaticPaths, getStaticProps }
export default CollectionView
