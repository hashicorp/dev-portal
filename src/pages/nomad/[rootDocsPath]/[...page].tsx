import { cachedGetProductData } from 'lib/get-product-data'
import { RootDocsPath } from 'types/products'
import {
	generateGetStaticPaths,
	generateGetStaticProps,
} from 'views/docs-view/server'
import DocsView from 'views/docs-view'

const getStaticPaths = async () => {
	let paths = []

	const promises = []
	const productData = cachedGetProductData('nomad')
	productData.rootDocsPaths.forEach((rootDocsPath: RootDocsPath) => {
		const { name, shortName, path } = rootDocsPath
		promises.push(
			generateGetStaticPaths({
				product: productData,
				basePath: path,
				baseName: shortName || name,
			})()
		)
	})

	// TODO rename
	const values = await Promise.all(promises)
	values.forEach((value) => {
		paths = [...paths, ...value.paths]
	})

	return {
		paths,
		fallback: 'blocking',
	}
}

const getStaticProps = async (context) => {
	const productData = cachedGetProductData('nomad')
	const rootDocsPath = productData.rootDocsPaths.find(({ path }) => {
		return path === context.params.rootDocsPath
	})
	const generatedGetStaticProps = generateGetStaticProps({
		product: productData,
		basePath: rootDocsPath.path,
		baseName: rootDocsPath.shortName || rootDocsPath.name,
	})
	const generatedProps = await generatedGetStaticProps(context)
	return generatedProps
}

export { getStaticPaths, getStaticProps }
export default DocsView
