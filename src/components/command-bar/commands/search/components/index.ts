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
import IntegrationHit, {
	IntegrationHitObject,
} from './integrations-tab-contents/integration-hit'
import NoResultsMessage from './no-results-message'
import RecentSearches, {
	RecentSearch,
	RecentSearchesProps,
} from './recent-searches'
import SuggestedPages, { SuggestedPage } from './suggested-pages'
import TabContentsCta from './tab-contents-cta'
import TutorialHit, {
	TutorialHitObject,
} from './tutorials-tab-contents/tutorial-hit'
import TutorialsTabContents from './tutorials-tab-contents'
import TabHeadingWithCount from './tab-heading-with-count'

export type {
	DocumentationHitObject,
	IntegrationHitObject,
	RecentSearch,
	RecentSearchesProps,
	SuggestedPage,
	TutorialHitObject,
}
export {
	CustomHitsContainer,
	DocumentationHit,
	DocumentationTabContents,
	IntegrationHit,
	IntegrationsTabContents,
	NoResultsMessage,
	RecentSearches,
	SuggestedPages,
	TabContentsCta,
	TabHeadingWithCount,
	TutorialHit,
	TutorialsTabContents,
}
