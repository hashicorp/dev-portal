/**
 * Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductOption, SectionOption } from 'lib/learn-client/types'

type SplitLearnPath = [
	string, // the leading slash
	'collections' | 'tutorials',
	ProductOption | SectionOption,
	string
]

interface RewriteTutorialLinksPluginOptions {
	contentType?: 'docs' | 'tutorials'
	tutorialMap?: Record<string, Record<string, string>>
}

export type { RewriteTutorialLinksPluginOptions, SplitLearnPath }
