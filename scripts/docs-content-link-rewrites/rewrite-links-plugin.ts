import { Definition, Link } from 'mdast'
import { Plugin } from 'unified'
import visit from 'unist-util-visit'
import { processDocsNode } from 'lib/remark-plugins/remark-plugin-adjust-link-urls/helpers'
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
				// Apply changes made by the tutorials link rewriter
				node.url = rewriteTutorialsLink(originalUrl, TUTORIAL_MAP, 'docs')

				// Apply changes on top of that with the docs link rewriter
				// (this helper modifies `node.url`, does not return new url)
				processDocsNode({ node, currentPath, urlAdjustFn })
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
