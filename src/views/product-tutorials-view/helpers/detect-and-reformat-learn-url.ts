import { getTutorialMap } from 'lib/remark-plugins/rewrite-tutorial-links/utils'
import { rewriteTutorialsLink } from 'lib/remark-plugins/rewrite-tutorial-links'

let TUTORIAL_MAP

/**
 * Given a URL string, if it is a Learn URL that can be rewritten, reformat the
 * URL to work with dev-dot's URL structure. Otherwise, return the URL
 * unmodified.
 */
async function detectAndReformatLearnUrl(url: string): Promise<string> {
	TUTORIAL_MAP = await getTutorialMap()

	return rewriteTutorialsLink(url, TUTORIAL_MAP) ?? url
}

export default detectAndReformatLearnUrl
