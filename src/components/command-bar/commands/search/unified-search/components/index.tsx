/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import CustomHitsContainer from './custom-hits-container'
import DocumentationHit, {
	DocumentationHitObject,
} from './documentation-tab-contents/documentation-hit'
import DocumentationTabContents from './documentation-tab-contents'
import IntegrationsTabContents from './integrations-tab-contents'
import TutorialHit, {
	TutorialHitObject,
} from './tutorials-tab-contents/tutorial-hit'
import TutorialsTabContents from './tutorials-tab-contents'

//
export * from './dialog-body'
export * from './dialog-contents'

export type { DocumentationHitObject, TutorialHitObject }
export {
	CustomHitsContainer,
	DocumentationHit,
	DocumentationTabContents,
	IntegrationsTabContents,
	TutorialHit,
	TutorialsTabContents,
}
