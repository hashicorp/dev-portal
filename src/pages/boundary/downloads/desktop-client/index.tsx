import boundaryData from 'data/boundary.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateGetStaticProps } from 'views/product-downloads-view/server'

const getStaticProps = generateGetStaticProps(boundaryData as ProductData, {
	installName: 'Boundary Desktop Client',
	releaseSlug: 'boundary-desktop',
	jsonFilePath: `src/content/${boundaryData.slug}/install-desktop-client-landing.json`,
})

export { getStaticProps }
export default ProductDownloadsView
