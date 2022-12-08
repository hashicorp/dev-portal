import path from 'path'
import { VFile } from 'vfile'
import { productSlugsToHostNames } from 'lib/products'
import { Definition, Link } from 'mdast'
import { Plugin } from 'unified'
import visit from 'unist-util-visit'

const DOT_IO_HOSTNAMES = Object.values(productSlugsToHostNames)

interface VFileData {
	linksToRewrite: Record<string, string>
	unrewriteableLinks: string[]
}

interface CustomVFile extends VFile {
	data: VFileData
}

const getIsRelativePath = (url: string) => {
	try {
		new URL(url)
		return false
	} catch (e) {
		return true
	}
}

const handleRelativeUrl = ({
	currentFilePath,
	linksToRewrite,
	product,
	unrewriteableLinks,
	url,
}) => {
	const productSlug = product.slug
	const basePaths = product.basePaths

	if (url.startsWith('/')) {
		const [, basePath] = url.split('/')
		if (basePaths.includes(basePath)) {
			linksToRewrite[url] = `/${productSlug}${url}`
		} else {
			unrewriteableLinks.push(url)
		}
		return
	}

	if (url.startsWith('./')) {
		const joinedUrl = path.join(
			currentFilePath.split('/').slice(0, -1).join('/'),
			url.slice(2)
		)
		linksToRewrite[url] = `/${productSlug}${joinedUrl}`
		return
	}

	if (url.startsWith('../')) {
		let dotsCount = 0
		const withoutDots = url.split('/').filter((part) => {
			const isDots = part === '..'
			if (isDots) {
				dotsCount += 1
			}

			return !isDots
		})

		const joinedUrl = path.join(
			withoutDots.join('/'),
			currentFilePath
				.split('/')
				.slice(0, -(dotsCount + 1))
				.join('/')
		)
		linksToRewrite[url] = `/${productSlug}/${joinedUrl}`
		return
	}

	const joinedUrl = path.join(
		currentFilePath.split('/').slice(0, -2).join('/'),
		url
	)
	linksToRewrite[url] = `/${productSlug}${joinedUrl}`
}

const handleNonRelativeLearnUrl = ({
	learnToDevDotPaths,
	linksToRewrite,
	unrewriteableLinks,
	url,
}) => {
	const urlObject = new URL(url)

	// Only include the `in` param for the `learnToDevDotPaths` search string
	let urlToCheck = `${urlObject.origin}${urlObject.pathname}`
	if (urlObject.searchParams.has('in')) {
		urlToCheck += `?in=${urlObject.searchParams.get('in')}`
		// Remove the param since it's not used in dev-portal
		urlObject.searchParams.delete('in')
	}

	const replacementPath = learnToDevDotPaths[urlToCheck]
	if (replacementPath) {
		linksToRewrite[url] = urlObject.toString()
	} else {
		unrewriteableLinks.push(url)
	}
}

const handleNonRelativeDeveloperUrl = ({ linksToRewrite, pathname, url }) => {
	linksToRewrite[url] = pathname
}

const handleNonRelativeDotIoUrl = ({
	pathname,
	origin,
	dotIoToDevDotPaths,
	linksToRewrite,
	unrewriteableLinks,
	url,
}) => {
	const [, basePath, ...restParts] = pathname.split('/')
	const adjustedBasePath = basePath === 'api' ? 'api-docs' : basePath
	const originAndBasePath = `${origin}/${adjustedBasePath}`

	const replacementPath = dotIoToDevDotPaths[originAndBasePath]
	if (replacementPath) {
		const restOfPath = restParts.join('/')
		linksToRewrite[url] = path.join(replacementPath, restOfPath)
	} else {
		unrewriteableLinks.push(url)
	}
}

const handleNonRelativePath = ({
	dotIoToDevDotPaths,
	learnToDevDotPaths,
	linksToRewrite,
	unrewriteableLinks,
	url,
}) => {
	const { hostname, origin, pathname } = new URL(url)
	const hostnameWithoutWww = hostname.replace(/^www\./, '')

	if (hostname === 'learn.hashicorp.com') {
		handleNonRelativeLearnUrl({
			learnToDevDotPaths,
			linksToRewrite,
			unrewriteableLinks,
			url,
		})
	} else if (hostname === 'developer.hashicorp.com') {
		handleNonRelativeDeveloperUrl({ linksToRewrite, pathname, url })
	} else if (DOT_IO_HOSTNAMES.includes(hostnameWithoutWww)) {
		handleNonRelativeDotIoUrl({
			pathname,
			origin,
			dotIoToDevDotPaths,
			linksToRewrite,
			unrewriteableLinks,
			url,
		})
	} else {
		unrewriteableLinks.push(url)
	}
}

const rewriteLinksPlugin: Plugin = ({
	dotIoToDevDotPaths,
	learnToDevDotPaths,
	product,
	currentFilePath,
}) => {
	return async function transformer(tree, file: CustomVFile) {
		return visit(tree, ['link', 'definition'], (node: Link | Definition) => {
			/**
			 * Return early for URLs we aren't concerned about.
			 */
			if (!node.url || node.url.startsWith('#')) {
				return
			}

			/**
			 * Initialize the file.data properties we'll write to.
			 */
			const data = file.data as VFileData
			if (!data.linksToRewrite) {
				data.linksToRewrite = {}
			}
			if (!data.unrewriteableLinks) {
				data.unrewriteableLinks = []
			}

			/**
			 * Check if the path is relative or not, and handle it based on that.
			 */
			const isRelativePath = getIsRelativePath(node.url)
			if (isRelativePath) {
				handleRelativeUrl({
					currentFilePath,
					linksToRewrite: data.linksToRewrite,
					product,
					unrewriteableLinks: data.unrewriteableLinks,
					url: node.url,
				})
			} else {
				handleNonRelativePath({
					dotIoToDevDotPaths,
					learnToDevDotPaths,
					linksToRewrite: data.linksToRewrite,
					unrewriteableLinks: data.unrewriteableLinks,
					url: node.url,
				})
			}
		})
	}
}

export type { CustomVFile }
export default rewriteLinksPlugin
