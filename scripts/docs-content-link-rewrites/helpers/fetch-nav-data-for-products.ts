import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import { productSlugs } from 'lib/products'
import { cachedGetProductData } from 'lib/get-product-data'
import fetchVersionsForProducts from './fetch-versions-for-products'

function sleep(delay: number) {
	return new Promise((resolve) => setTimeout(resolve, delay))
}

async function fetchNavData(
	product: string, //: string, // waypoint
	basePath: string, //: string, // commands | docs | plugins
	version: string //: string // v0.5.x
): Promise<any> {
	const fullPath = `nav-data/${version}/${basePath}`
	const url = `${process.env.MKTG_CONTENT_API}/api/content/${product}/${fullPath}`

	const response = await fetch(url)

	if (response.status !== 200) {
		throw new Error(`Failed to fetch: ${url} (status ${response.status})`)
	}

	const { result } = await response.json()
	return result
}

const pickUrlsFromNavData = (navData, urlSet) => {
	navData.forEach((item) => {
		if (item.path || item.href) {
			urlSet.add(item.path ?? item.href)
		} else if (item.routes?.length > 0) {
			pickUrlsFromNavData(item.routes, urlSet)
		}
	})
}

const fetchNavDataForProducts = async ({ generatedFilesFolderPath }) => {
	const generatedVersionsFolder = path.join(
		generatedFilesFolderPath,
		'versions'
	)
	if (!fs.existsSync(generatedVersionsFolder)) {
		await fetchVersionsForProducts({ generatedFilesFolderPath })
	}

	const outputFolder = path.join(generatedFilesFolderPath, 'nav-data-urls')
	if (!fs.existsSync(outputFolder)) {
		fs.mkdirSync(outputFolder)
	}

	const allLoaderSlugs = []
	const versionDataByLoaderSlug = {}
	const versionFileNames = fs.readdirSync(generatedVersionsFolder)
	versionFileNames.forEach((versionFileName) => {
		const slugForLoader = versionFileName.slice(0, -'.json'.length)
		allLoaderSlugs.push(slugForLoader)

		const versionFilePath = path.join(generatedVersionsFolder, versionFileName)
		versionDataByLoaderSlug[slugForLoader] = JSON.parse(
			fs.readFileSync(versionFilePath, 'utf-8')
		)
	})

	const navDataRequestsArgs: [string, string, string][] = []
	productSlugs.forEach((productSlug) => {
		if (productSlug === 'sentinel') {
			return
		}

		const productData = cachedGetProductData(productSlug)
		productData.rootDocsPaths.forEach((rootDocsPath) => {
			const basePath: string = rootDocsPath.navDataPrefix ?? rootDocsPath.path
			const slugForLoader: string =
				rootDocsPath.productSlugForLoader ?? productSlug

			const versionData = versionDataByLoaderSlug[slugForLoader]
			versionData.forEach(
				({ version, isLatest }: { version: string; isLatest: boolean }) => {
					let fetchNavDataArgs: [string, string, string]
					if (productSlug === 'boundary' && basePath === 'api-docs') {
						return
					} else if (
						(productSlug === 'packer' && basePath === 'plugins') ||
						(productSlug === 'nomad' && basePath === 'plugins') ||
						(productSlug === 'nomad' && basePath === 'tools')
					) {
						if (isLatest) {
							fetchNavDataArgs = [
								slugForLoader,
								basePath.replaceAll('/', '-'),
								'latest',
							]
						} else {
							return
						}
					} else {
						fetchNavDataArgs = [
							slugForLoader,
							basePath.replaceAll('/', '-'),
							version,
						]
					}
					navDataRequestsArgs.push(fetchNavDataArgs)
				}
			)
		})
	})

	const navDataByLoaderSlug = {}
	allLoaderSlugs.forEach((loaderSlug) => {
		navDataByLoaderSlug[loaderSlug] = new Set()
	})

	for (let i = 0; i < navDataRequestsArgs.length; i++) {
		const requestArgs = navDataRequestsArgs[i]
		const loaderSlug = requestArgs[0]

		await sleep(200)

		fetchNavData(...requestArgs)
			.then(({ navData }) => {
				pickUrlsFromNavData(navData, navDataByLoaderSlug[loaderSlug])
			})
			.catch((e) => {
				console.log(`Error fetching for ${requestArgs}: ${e}`)
			})
	}

	allLoaderSlugs.forEach((loaderSlug) => {
		const outputFilePath = path.join(outputFolder, `${loaderSlug}.json`)
		const urls = Array.from(navDataByLoaderSlug[loaderSlug])
		fs.writeFileSync(outputFilePath, JSON.stringify(urls, null, 2))
	})
}

export default fetchNavDataForProducts
