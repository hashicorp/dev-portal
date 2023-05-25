/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import TutorialsLandingContentCardLink from './tutorials-landing-content-card-link'
import TutorialsLandingCollectionContentCardLink from './tutorials-landing-collection-content-card-link'

const TutorialsLandingView = () => null

export default Object.assign(TutorialsLandingView, {
	ContentCardLink: TutorialsLandingContentCardLink,
	CollectionContentCardLink: TutorialsLandingCollectionContentCardLink,
})
