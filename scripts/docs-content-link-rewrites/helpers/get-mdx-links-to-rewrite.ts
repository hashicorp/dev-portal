import fs from 'fs'
import remark from 'remark'
import rewriteLinksPlugin from '../rewrite-links-plugin'

const getMdxLinksToRewrite = async ({
	filePathPrefix,
	filePaths,
	urlAdjustFn,
}: {
	filePathPrefix: string
	filePaths: string[]
	urlAdjustFn: (url: string) => string
}): Promise<{
	mdxLinksToRewrite: Record<string, Record<string, string>>
	mdxUnrewriteableLinks: Record<string, Record<string, string>>
}> => {
	const mdxLinksToRewrite = {}
	const mdxUnrewriteableLinks = {}

	for (let i = 0; i < filePaths.length; i++) {
		const filePath = filePaths[i]
		if (!filePath.endsWith('.mdx')) {
			return
		}

		const filePathWithoutPrefix = filePath.replace(filePathPrefix, '')
		const currentPath = filePathWithoutPrefix.replace(/(index)?\.mdx$/, '')
		const fileContent = fs.readFileSync(filePath, 'utf-8')
		const data = {
			linksToRewrite: {},
			unrewriteableLinks: [],
		}
		await remark()
			.use(rewriteLinksPlugin, {
				currentPath,
				statistics: data,
				urlAdjustFn,
			})
			.process(fileContent)

		const { linksToRewrite, unrewriteableLinks } = data
		const hasLinksToRewrite = Object.keys(linksToRewrite).length > 0
		if (hasLinksToRewrite) {
			mdxLinksToRewrite[filePath] = linksToRewrite
		}
		const hasUnrewriteableLinks = unrewriteableLinks.length > 0
		if (hasUnrewriteableLinks) {
			mdxUnrewriteableLinks[filePath] = unrewriteableLinks
		}
	}

	return {
		mdxLinksToRewrite,
		mdxUnrewriteableLinks,
	}
}

export { getMdxLinksToRewrite }
