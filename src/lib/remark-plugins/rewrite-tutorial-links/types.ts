/**
 * Copyright (c) HashiCorp, Inc.
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
	tutorialMap?: Record<string, string>
}

export type { RewriteTutorialLinksPluginOptions, SplitLearnPath }
