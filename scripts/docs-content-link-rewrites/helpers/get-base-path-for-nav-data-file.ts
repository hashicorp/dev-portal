import { ProductData, RootDocsPath } from 'types/products'

/**
 * Given a `-nav-data.json` file path and the product data associated with it,
 * returns the base path assocated with the the nav data.
 */
const getBasePathForNavDataFile = ({
	filePath,
	productData,
}: {
	filePath: string
	productData: ProductData
}) => {
	const fileName = filePath.split('/').slice(-1)[0]
	const matchingRootDocsPath = productData.rootDocsPaths.find(
		(rootDocsPath: RootDocsPath) => {
			const prefixToTest = rootDocsPath.navDataPrefix ?? rootDocsPath.path
			return fileName.startsWith(prefixToTest)
		}
	)

	if (!matchingRootDocsPath) {
		throw new Error(`Could not find matching docs path for: "${filePath}"`)
	}

	return matchingRootDocsPath.path
}

export { getBasePathForNavDataFile }
