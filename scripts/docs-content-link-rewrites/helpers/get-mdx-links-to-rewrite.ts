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
			continue
		}

		const filePathWithoutPrefix = filePath.replace(filePathPrefix, '')
		const currentPath = filePathWithoutPrefix.replace(/(index)?\.mdx$/, '')

		/**
		 * Don't rewrite links in files that are at the root of the content
		 * directory. These files are used for content rendered at the top-level of
		 * various sites.
		 *
		 * Example of a file that should not have its links rewritten:
		 * https://github.com/hashicorp/cloud.hashicorp.com/blob/f7e1db477f8c2b842c1e8a18047a54297e9b295d/content/roles-responsibilities.mdx
		 */
		const isAtContentRoot = !currentPath.slice(1).includes('/')
		if (isAtContentRoot) {
			continue
		}

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
