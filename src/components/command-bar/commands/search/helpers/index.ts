/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { generateSuggestedPages } from './generate-suggested-pages'
import { generateTutorialLibraryCta } from './generate-tutorial-library-cta'
import { getCurrentProductTag } from './get-current-product-tag'
import { useHitsContext } from './hit-counts-provider'

export {
	generateSuggestedPages,
	generateTutorialLibraryCta,
	getCurrentProductTag,
	useHitsContext,
}
