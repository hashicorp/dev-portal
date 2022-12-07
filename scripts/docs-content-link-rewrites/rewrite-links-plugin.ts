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

	if (url.startsWith('#')) {
		return
	}

	if (url.startsWith('/')) {
		const [, basePath] = url.split('/')
		if (basePaths.includes(basePath)) {
			linksToRewrite[url] = `/${productSlug}${url}`
		} else {
			unrewriteableLinks.push(url)
		}
		return
	}

	const pathParths = url.split('/')
	const currentFilePathParts = currentFilePath.split('/')
	const countDotsParts = pathParths.filter((part) => part === '..').length
	const joined = [
		...currentFilePathParts.slice(
			0,
			!url.startsWith('.') ? -2 : -(countDotsParts + 1)
		),
		...pathParths.filter((part) => part !== '..'),
	].join('/')
	linksToRewrite[url] = `/${path.join(product.slug, joined)}`
}

const handleNonRelativeLearnUrl = ({
	learnToDevDotPaths,
	linksToRewrite,
	unrewriteableLinks,
	url,
}) => {
	const replacementPath = learnToDevDotPaths[url]
	if (replacementPath) {
		linksToRewrite[url] = replacementPath
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
