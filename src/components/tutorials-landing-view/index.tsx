/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import TutorialsLandingCertificationContentCardLink from './tutorials-landing-certification-content-card-link'
import TutorialsLandingCollectionContentCardLink from './tutorials-landing-collection-content-card-link'
import TutorialsLandingContentCardLink from './tutorials-landing-content-card-link'

const TutorialsLandingView = () => null

export default Object.assign(TutorialsLandingView, {
	CertificationContentCardLink: TutorialsLandingCertificationContentCardLink,
	CollectionContentCardLink: TutorialsLandingCollectionContentCardLink,
	ContentCardLink: TutorialsLandingContentCardLink,
})
