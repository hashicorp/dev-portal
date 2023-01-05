import fs from 'fs'
import remark from 'remark'
import { ProductSlug } from 'types/products'
import { cachedGetProductData } from 'lib/get-product-data'
import rewriteLinksPlugin from '../rewrite-links-plugin'

const getMdxLinksToRewrite = async ({
	dotIoToDevDotPaths,
	filePathPrefix,
	filePaths,
	learnToDevDotPaths,
	normalizedProductSlug,
}: {
	dotIoToDevDotPaths: Record<string, string>
	filePathPrefix: string
	filePaths: string[]
	learnToDevDotPaths: Record<string, string>
	normalizedProductSlug: ProductSlug
}): Promise<{
	mdxLinksToRewrite: Record<string, Record<string, string>>
	mdxUnrewriteableLinks: string[]
}> => {
	const mdxLinksToRewrite = {}
	let mdxUnrewriteableLinks = []

	const productData = cachedGetProductData(normalizedProductSlug)

	for (let i = 0; i < filePaths.length; i++) {
		const filePath = filePaths[i]
		if (!filePath.endsWith('.mdx')) {
			return
		}

		const filePathWithoutPrefix = filePath.replace(filePathPrefix, '')
		const fileContent = fs.readFileSync(filePath, 'utf-8')
		const {
			// TODO put in a real TS fix
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			data: { linksToRewrite = {}, unrewriteableLinks = [] },
		} = await remark()
			.use(rewriteLinksPlugin, {
				dotIoToDevDotPaths,
				learnToDevDotPaths,
				currentFilePath: filePathWithoutPrefix,
				product: productData,
			})
			.process(fileContent)

		const hasLinksToRewrite = Object.keys(linksToRewrite).length > 0
		if (hasLinksToRewrite) {
			mdxLinksToRewrite[filePath] = linksToRewrite
		}

		const hasUnrewriteableLinks = unrewriteableLinks.length > 0
		if (hasUnrewriteableLinks) {
			mdxUnrewriteableLinks = [...mdxUnrewriteableLinks, ...unrewriteableLinks]
		}
	}

	return {
		mdxLinksToRewrite,
		mdxUnrewriteableLinks,
	}
}

export { getMdxLinksToRewrite }
