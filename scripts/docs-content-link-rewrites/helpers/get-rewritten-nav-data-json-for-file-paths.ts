import fs from 'fs'
import path from 'path'
import { ProductSlug } from 'types/products'
import { cachedGetProductData } from 'lib/get-product-data'
import { getRewrittenNonRelativeUrl } from '../rewrite-links-plugin'
import { getBasePathForNavDataFile } from './get-base-path-for-nav-data-file'

const recursivelyUpdateNavItem = ({
	currentPath,
	item,
	learnToDevDotPaths,
	dotIoToDevDotPaths,
}) => {
	const isPathItem = item.hasOwnProperty('path')
	const isHrefItem = item.hasOwnProperty('href')
	const isRoutesItem = item.hasOwnProperty('routes')

	if (isPathItem || isHrefItem) {
		const itemPropertyName = isPathItem ? 'path' : 'href'
		const url = item[itemPropertyName]

		try {
			const urlObject = new URL(url)
			const rewrittenUrl = getRewrittenNonRelativeUrl({
				dotIoToDevDotPaths,
				learnToDevDotPaths,
				urlObject,
			})
			if (rewrittenUrl) {
				item[itemPropertyName] = rewrittenUrl
			}
		} catch (e) {
			/**
			 * Assume the url is already rewritten
			 *
			 * @TODO (ashleemboyer) Update after holiday break.
			 * This will not 100% work for everything, but does work for Waypoint.
			 */
			if (url.startsWith('/')) {
				return
			}

			item[itemPropertyName] = path.join(currentPath, url)
		}
	}

	if (isRoutesItem) {
		item.routes.forEach((routeItem) => {
			recursivelyUpdateNavItem({
				currentPath,
				item: routeItem,
				learnToDevDotPaths,
				dotIoToDevDotPaths,
			})
		})
	}
}

const getRewrittenNavDataJsonForFilePaths = async ({
	filePaths,
	dotIoToDevDotPaths,
	learnToDevDotPaths,
	normalizedProductSlug,
}: {
	filePaths: string[]
	dotIoToDevDotPaths: Record<string, string>
	learnToDevDotPaths: Record<string, string>
	normalizedProductSlug: ProductSlug
}) => {
	const allRewrittenNavData = {}

	const productData = cachedGetProductData(normalizedProductSlug)
	filePaths.forEach((filePath) => {
		if (!filePath.endsWith('-nav-data.json')) {
			return
		}

		const basePath = getBasePathForNavDataFile({ filePath, productData })
		const fileContent = fs.readFileSync(filePath, 'utf-8')
		const navData = JSON.parse(fileContent)

		const newNavData = navData.map((item) => {
			const itemCopy = { ...item }
			recursivelyUpdateNavItem({
				currentPath: `/${productData.slug}/${basePath}`,
				item: itemCopy,
				learnToDevDotPaths,
				dotIoToDevDotPaths,
			})
			return itemCopy
		})
		allRewrittenNavData[filePath] = newNavData
	})

	return allRewrittenNavData
}

export { getRewrittenNavDataJsonForFilePaths }
