import fs from 'fs'
import remark from 'remark'
import { cachedGetProductData } from 'lib/get-product-data'
import rewriteLinksPlugin from '../rewrite-links-plugin'
import { ProductSlug } from 'types/products'

const getAllLinksToRewrite = async ({
	filePaths,
	dotIoToDevDotPaths,
	learnToDevDotPaths,
	normalizedProductSlug,
}: {
	filePaths: string[]
	dotIoToDevDotPaths: Record<string, string>
	learnToDevDotPaths: Record<string, string>
	normalizedProductSlug: ProductSlug
}): Promise<{
	allLinksToRewrite: Record<string, Record<string, string>>
	allUnrewriteableLinks: string[]
}> => {
	const allLinksToRewrite = {}
	let allUnrewriteableLinks = []

	for (let i = 0; i < filePaths.length; i++) {
		const filePath = filePaths[i]
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
				currentFilePath: filePath,
				product: cachedGetProductData(normalizedProductSlug),
			})
			.process(fileContent)

		const hasLinksToRewrite = Object.keys(linksToRewrite).length > 0
		if (hasLinksToRewrite) {
			allLinksToRewrite[filePath] = linksToRewrite
		}

		const hasUnrewriteableLinks = unrewriteableLinks.length > 0
		if (hasUnrewriteableLinks) {
			allUnrewriteableLinks = [...allUnrewriteableLinks, ...unrewriteableLinks]
		}
	}

	return {
		allLinksToRewrite,
		allUnrewriteableLinks,
	}
}

export { getAllLinksToRewrite }
