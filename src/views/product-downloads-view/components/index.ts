/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * This purpose of this barrel file is to help keep the import section of
 * `ProductDownloadsView` clean. This is not a standard process used across the
 * project because it affects build times when used in `src/components`, but is
 * helpful where all components in the barrel file are always used together at
 * the same time.
 */

import DownloadsSection from './downloads-section'
import FeaturedLearnCardsSection from './featured-learn-cards-section'
import PageHeader from './page-header'
import ReleaseInformationSection from './release-information'
import SidecarMarketingCard from './sidecar-marketing-card'

export {
	DownloadsSection,
	FeaturedLearnCardsSection,
	PageHeader,
	ReleaseInformationSection,
	SidecarMarketingCard,
}
