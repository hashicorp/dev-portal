import { Definition, Link } from 'mdast'
import { Plugin } from 'unified'
import visit from 'unist-util-visit'
import { processDocsLinkNode } from 'lib/remark-plugins/remark-plugin-adjust-link-urls/helpers'
import { rewriteTutorialsLink } from 'lib/remark-plugins/rewrite-tutorial-links/utils/rewrite-tutorials-link'
import { getTutorialMap } from 'lib/remark-plugins/rewrite-tutorial-links/utils'

let TUTORIAL_MAP

const rewriteLinksPlugin: Plugin = ({
	urlAdjustFn,
	currentPath,
	statistics = { linksToRewrite: {}, unrewriteableLinks: [] },
}: {
	currentPath: string
	statistics?: {
		linksToRewrite: Record<string, string>
		unrewriteableLinks: string[]
	}
	urlAdjustFn: (url: string) => string
}) => {
	return async function transformer(tree) {
		if (!TUTORIAL_MAP) {
			TUTORIAL_MAP = await getTutorialMap()
		}
		return visit(tree, ['link', 'definition'], (node: Link | Definition) => {
			const originalUrl = `${node.url}`

			// Only adjust if the URL is not empty
			if (node.url !== '') {
				// First, use the docs link rewriter
				const processedAdDocsLink = processDocsLinkNode({
					node,
					currentPath,
					urlAdjustFn,
				})

				// Then apply changes on top of that with the tutorials link rewriter
				node.url = rewriteTutorialsLink(
					processedAdDocsLink,
					TUTORIAL_MAP,
					'docs'
				)
			}

			// Record the URL in `statistics` based on whether or not it changed
			const finalUrl = `${node.url}`
			const { linksToRewrite = {}, unrewriteableLinks = [] } = statistics
			if (finalUrl !== originalUrl) {
				linksToRewrite[originalUrl] = finalUrl
			} else {
				unrewriteableLinks.push(originalUrl)
			}
		})
	}
}

export default rewriteLinksPlugin
