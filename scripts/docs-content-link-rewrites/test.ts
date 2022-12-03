import fs from 'fs'
import path from 'path'
import fetchNavDataForProducts from './helpers/fetch-nav-data-for-products'

const makeFilterUrlsFunction = ({ allLoaderSlugs, allUrlsByLoaderSlug }) => {
	return (filterFunction): Record<string, string[]> => {
		const allUrls = {}

		allLoaderSlugs.forEach((loaderSlug) => {
			const urls = []
			allUrlsByLoaderSlug[loaderSlug]
				.filter(filterFunction)
				.forEach((url) => urls.push(url))

			if (urls.length > 0) {
				allUrls[loaderSlug] = urls
			}
		})

		return allUrls
	}
}

;(async function () {
	const generatedFilesFolderPath = path.join(__dirname, '.generated')
	const generatedNavDataFolder = path.join(
		generatedFilesFolderPath,
		'nav-data-urls'
	)
	if (!fs.existsSync(generatedNavDataFolder)) {
		await fetchNavDataForProducts({ generatedFilesFolderPath })
	}

	const allLoaderSlugs = []
	const allUrlsByLoaderSlug = {}
	const fileNames = fs.readdirSync(generatedNavDataFolder)
	fileNames.forEach((fileName) => {
		const loaderSlug = fileName.slice(0, -'.json'.length)
		allLoaderSlugs.push(loaderSlug)

		const filePath = path.join(generatedNavDataFolder, fileName)
		const urls = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
		allUrlsByLoaderSlug[loaderSlug] = urls
	})

	/**
	 * Build reusable function for filtering URLs
	 */
	const filterUrls = makeFilterUrlsFunction({
		allLoaderSlugs,
		allUrlsByLoaderSlug,
	})

	/**
	 * @TODO analyze URLs that start with a `/`
	 */
	const topLevelUrls = filterUrls((url) => url.startsWith('/'))

	/**
	 * @TODO analyze legacy Learn URLs
	 */
	const legacyLearnURLs = filterUrls((url) => {
		try {
			const urlObject = new URL(url)
			return urlObject.origin === 'https://learn.hashicorp.com'
		} catch (e) {
			return false
		}
	})

	/**
	 * @TODO analyze other types of URLs
	 */
})()

// const getArguments = () => {
// 	const { product, navDataDirectory, contentDirectory } = yargs
// 		.option('product', {
// 			description: 'the slug of a product',
// 			choices: [...productSlugs].sort(),
// 		})
// 		.option('navDataDirectory', {
// 			description: 'the path of the folder with all nav-data.json files',
// 			type: 'string',
// 		})
// 		.option('contentDirectory', {
// 			description: 'the path of the folder with all docs content MDX files',
// 			type: 'string',
// 		})
// 		.demandOption(['product', 'navDataDirectory', 'contentDirectory'])
// 		.help().argv

// 	return { product, navDataDirectory, contentDirectory }
// }

// const updateNavDataItem = ({ product, basePath, navDataItem }) => {
// 	const itemCopy = { ...navDataItem }
// 	const { divider, title, path, href, routes } = itemCopy

// 	if (routes?.length > 0) {
// 		itemCopy.routes = navDataItem.routes.map((childItem) =>
// 			updateNavDataItem({ product, basePath, navDataItem: childItem })
// 		)
// 	}

// 	if (typeof path === 'string' || typeof href === 'string') {
// 		const urlPropertyName = typeof path === 'string' ? 'path' : 'href'
// 		const urlPropertyValue = navDataItem[urlPropertyName]

// 		const urlObject = new URL(
// 			urlPropertyValue,
// 			'https://developer.hashicorp.com'
// 		)
// 		if (urlObject.hostname === 'developer.hashicorp.com') {
// 			// is an internal path
// 			itemCopy[urlPropertyName] = `/${_path.join(
// 				product,
// 				basePath,
// 				urlPropertyValue
// 			)}`
// 		} else {
// 			// is an external url
// 			// TODO
// 			console.log(urlPropertyValue)
// 		}
// 	}

// 	return itemCopy
// }

// const handleNavDataDirectory = ({
// 	product,
// 	directory,
// }: {
// 	product: ProductSlug
// 	directory: string
// }) => {
// 	console.log(`Handling navDataDirectory (${directory})`)

// 	const basePaths = []
// 	const updatedNavData = {}

// 	try {
// 		const directoryExists = fs.existsSync(directory)
// 		if (!directoryExists) {
// 			throw new Error(`The "${directory}" directory does not exist.`)
// 		}

// 		const navDataFileNames = fs.readdirSync(directory)
// 		navDataFileNames.forEach((navDataFileName: string) => {
// 			if (!navDataFileName.endsWith('-nav-data.json')) {
// 				return
// 			}

// 			const navDataFilePath = _path.join(directory, navDataFileName)
// 			const [basePath] = navDataFileName.split('-')
// 			updatedNavData[basePath] = []
// 			basePaths.push(basePath)

// 			const fileContent = fs.readFileSync(navDataFilePath, 'utf-8')
// 			const navData = JSON.parse(fileContent)
// 			navData.forEach((navDataItem) => {
// 				const updatedItem = updateNavDataItem({
// 					basePath,
// 					navDataItem,
// 					product,
// 				})
// 				updatedNavData[basePath].push(updatedItem)
// 			})
// 		})
// 	} catch (e) {
// 		console.error(e.toString())
// 	}

// 	return { basePaths, updatedNavData }
// }

// const handleContentDirectory = ({
// 	product,
// 	directory,
// }: {
// 	product: ProductSlug
// 	directory: string
// }) => {
// 	console.log(`Handling contentDirectory (${directory})`)

// 	try {
// 		const directoryExists = fs.existsSync(directory)
// 		if (!directoryExists) {
// 			throw new Error(`The "${directory}" directory does not exist.`)
// 		}
// 	} catch (e) {
// 		console.error(e.toString())
// 	}
// }

// const main = () => {
// 	const { product, navDataDirectory, contentDirectory } = getArguments()

// 	const { basePaths, updatedNavData } = handleNavDataDirectory({
// 		product,
// 		directory: _path.join(process.cwd(), navDataDirectory),
// 	})

// 	handleContentDirectory({
// 		product,
// 		directory: _path.join(process.cwd(), contentDirectory),
// 	})
// }
