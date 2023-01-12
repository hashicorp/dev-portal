import path from 'path'
import { VFile } from 'vfile'
import { Definition, Link } from 'mdast'
import { Plugin } from 'unified'
import visit from 'unist-util-visit'
import { productSlugsToHostNames } from 'lib/products'
import { preAdjustUrl } from 'lib/remark-plugins/remark-plugin-adjust-link-urls/helpers'
import { getProductUrlAdjuster } from 'views/docs-view/utils/product-url-adjusters'

const DOT_IO_HOSTNAMES = Object.values(productSlugsToHostNames)

interface VFileData {
	linksToRewrite: Record<string, string>
	unrewriteableLinks: string[]
}

interface CustomVFile extends VFile {
	data: VFileData
}

const getIsRelativeUrl = (url: string) => {
	try {
		new URL(url)
		return false
	} catch (e) {
		return true
	}
}

const getRewrittenNonRelativeDotIoUrl = ({ dotIoToDevDotPaths, urlObject }) => {
	const { origin, pathname = '', search = '', hash = '' } = urlObject
	const [, basePath, ...restParts] = pathname.split('/')
	const adjustedBasePath = basePath === 'api' ? 'api-docs' : basePath
	const originAndBasePath = `${origin}/${adjustedBasePath}`

	const replacementPath = dotIoToDevDotPaths[originAndBasePath]
	if (replacementPath) {
		const restOfPath = restParts.join('/')
		const newPath = path.join(replacementPath, restOfPath)
		return `${newPath}${search}${hash}`
	}
}

const getRewrittenNonRelativeDeveloperUrl = ({ urlObject }) => {
	const { pathname = '', search = '', hash = '' } = urlObject
	return `${pathname}${search}${hash}`
}

const getRewrittenNonRelativeLearnUrl = ({ learnToDevDotPaths, urlObject }) => {
	const { origin, pathname = '', hash = '' } = urlObject

	// Only include the `in` param for the `learnToDevDotPaths` search string
	let urlToCheck = `${origin}${pathname}`
	if (urlObject.searchParams.has('in')) {
		urlToCheck += `?in=${urlObject.searchParams.get('in')}`
		// Remove the param since it's not used in dev-portal
		urlObject.searchParams.delete('in')
	}

	const replacementPath = learnToDevDotPaths[urlToCheck]
	if (replacementPath) {
		return `${replacementPath}${urlObject.search ?? ''}${hash}`
	}
}

const getRewrittenNonRelativeUrl = ({
	dotIoToDevDotPaths,
	learnToDevDotPaths,
	urlObject,
}) => {
	let rewrittenUrl

	const { hostname } = urlObject
	const hostnameWithoutWww = hostname.replace(/^www\./, '')

	if (hostname === 'learn.hashicorp.com') {
		rewrittenUrl = getRewrittenNonRelativeLearnUrl({
			learnToDevDotPaths,
			urlObject,
		})
	} else if (hostname === 'developer.hashicorp.com') {
		rewrittenUrl = getRewrittenNonRelativeDeveloperUrl({ urlObject })
	} else if (DOT_IO_HOSTNAMES.includes(hostnameWithoutWww)) {
		rewrittenUrl = getRewrittenNonRelativeDotIoUrl({
			dotIoToDevDotPaths,
			urlObject,
		})
	}

	return rewrittenUrl
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

	const currentFilePathAsRoute = currentFilePath.replace(/(\/index)?\.mdx/, '')
	const associatedPageRoute = `/${productSlug}${currentFilePathAsRoute}`
	const urlToAdjust = preAdjustUrl({ currentPath: associatedPageRoute, url })
	const adjustedUrl = getProductUrlAdjuster(product)(urlToAdjust)

	// If the URL has changed and it's a valid base path, track as rewriteable
	const basePath = adjustedUrl.split('/')[2]
	const isValidBasePath = basePaths.includes(basePath)
	if (adjustedUrl !== url && isValidBasePath) {
		if (isValidBasePath) {
			linksToRewrite[url] = adjustedUrl
			return
		}
	}

	// Otherwise, track as "unrewriteable"
	unrewriteableLinks.push(url)
}

const handleNonRelativeUrl = ({
	dotIoToDevDotPaths,
	learnToDevDotPaths,
	linksToRewrite,
	unrewriteableLinks,
	url,
}) => {
	const urlObject = new URL(url)

	const rewrittenUrl = getRewrittenNonRelativeUrl({
		dotIoToDevDotPaths,
		learnToDevDotPaths,
		urlObject,
	})
	if (rewrittenUrl) {
		linksToRewrite[url] = rewrittenUrl
	} else {
		unrewriteableLinks.push(url)
	}
}

/**
 * Check if the path is relative or not, and handle it based on that.
 */
const handleUrl = ({
	currentFilePath,
	dotIoToDevDotPaths,
	learnToDevDotPaths,
	linksToRewrite,
	product,
	unrewriteableLinks,
	url,
}) => {
	const isRelativePath = getIsRelativeUrl(url)
	if (isRelativePath) {
		handleRelativeUrl({
			currentFilePath,
			linksToRewrite: linksToRewrite,
			product,
			unrewriteableLinks: unrewriteableLinks,
			url: url,
		})
	} else {
		handleNonRelativeUrl({
			dotIoToDevDotPaths,
			learnToDevDotPaths,
			linksToRewrite: linksToRewrite,
			unrewriteableLinks: unrewriteableLinks,
			url: url,
		})
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

			handleUrl({
				currentFilePath,
				dotIoToDevDotPaths,
				learnToDevDotPaths,
				linksToRewrite: data.linksToRewrite,
				product,
				unrewriteableLinks: data.unrewriteableLinks,
				url: node.url,
			})
		})
	}
}

export type { CustomVFile }
export { DOT_IO_HOSTNAMES, getRewrittenNonRelativeUrl }
export default rewriteLinksPlugin
