import fs from 'fs'
import path from 'path'
import yargs from 'yargs'
import remark from 'remark'
import { productSlugs } from 'lib/products'
import { cachedGetProductData } from 'lib/get-product-data'
import rewriteLinksPlugin from './rewrite-links-plugin'
import { getLearnToDevDotUrlMap } from './helpers/get-learn-to-dev-dot-url-map'
import { getDocsToDevDotUrlMap } from './helpers/get-dot-io-to-dev-dot-url-map'
import { rewriteFileContentString } from './helpers/rewrite-file-content-string'

const getArguments = () => {
	const { product, contentDirectory } = yargs
		.option('product', {
			description: 'the slug of a product',
			choices: [
				...productSlugs,
				'terraform-cdk',
				'terraform-docs-agents',
				'ptfe-releases',
				'cloud.hashicorp.com',
			].sort(),
		})
		.option('contentDirectory', {
			description: 'the path of the folder with all docs content MDX files',
			type: 'string',
		})
		.demandOption(['product', 'contentDirectory'])
		.help().argv

	return { product, contentDirectory }
}

const normalizeLoaderSlug = (loaderSlug) => {
	return productSlugs.find((productSlug) => {
		if (loaderSlug === productSlug) {
			return true
		}

		const productData = cachedGetProductData(productSlug)
		return !!productData.rootDocsPaths.find((rootDocsPath) => {
			return loaderSlug === rootDocsPath.productSlugForLoader
		})
	})
}

const gatherMdxFilePaths = (directory, paths) => {
	fs.readdirSync(directory).forEach((item) => {
		const itemPath = path.join(directory, item)
		const stats = fs.statSync(itemPath)
		if (stats.isDirectory()) {
			gatherMdxFilePaths(itemPath, paths)
		} else if (itemPath.endsWith('.mdx')) {
			paths.push(itemPath)
		}
	})
}

const main = async () => {
	const { product, contentDirectory } = getArguments()

	const normalizedProductSlug = normalizeLoaderSlug(product)
	const contentDirectoryPath = path.join(process.cwd(), contentDirectory)

	const dotIoToDevDotPaths = await getDocsToDevDotUrlMap()
	const learnToDevDotPaths = await getLearnToDevDotUrlMap()

	const mdxFilePaths = []
	gatherMdxFilePaths(contentDirectoryPath, mdxFilePaths)

	for (let i = 0; i < mdxFilePaths.length; i++) {
		const filePath = mdxFilePaths[i]
		const fileContent = fs.readFileSync(filePath, 'utf-8')

		const {
			data: { linksToRewrite = {}, unrewriteableLinks = [] },
		} = await remark()
			.use(rewriteLinksPlugin, {
				dotIoToDevDotPaths,
				learnToDevDotPaths,
				currentFilePath: filePath.replace(contentDirectoryPath, ''),
				product: cachedGetProductData(normalizedProductSlug),
			})
			.process(fileContent)

		const hasLinksToRewrite = Object.keys(linksToRewrite).length > 0
		const hasUnrewriteableLinks = unrewriteableLinks.length > 0

		if (hasLinksToRewrite) {
			const updatedContent = rewriteFileContentString(
				fileContent,
				linksToRewrite
			)

			if (updatedContent === fileContent) {
				throw new Error(
					`None of the 'linksToRewrite' were rewritten for ${filePath}. There may be an issue with 'rewriteFileContentString'. The identified 'linksToRewrite' were:\n${JSON.stringify(
						linksToRewrite,
						null,
						2
					)}`
				)
			} else {
				fs.writeFileSync(filePath, updatedContent)
			}
		}

		if (hasUnrewriteableLinks) {
			// TODO analyze the unrewriteable links
		}
	}
}

main()
