/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import tutorialMap from 'data/_tutorial-map.generated.json'
import { rewriteTutorialsLink } from 'lib/remark-plugins/rewrite-tutorial-links/utils/rewrite-tutorials-link'

/**
 * Given a URL string, if it is a Learn URL that can be rewritten, reformat the
 * URL to work with dev-dot's URL structure. Otherwise, return the URL
 * unmodified.
 */
async function detectAndReformatLearnUrl(url: string): Promise<string> {
	return rewriteTutorialsLink(url, tutorialMap) ?? url
}

export default detectAndReformatLearnUrl
