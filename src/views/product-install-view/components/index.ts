/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * This purpose of this barrel file is to help keep the import section of
 * `ProductInstallView` clean. This is not a standard process used across the
 * project because it affects build times when used in `src/components`, but is
 * helpful where all components in the barrel file are always used together at
 * the same time.
 */

import DownloadsSection from './install-section'
import FeaturedLearnCardsSection from './featured-learn-cards-section'
import OfficialReleasesSection from './official-releases-section'
import PageHeader from './page-header'
import SidecarMarketingCard from './sidecar-marketing-card'

export {
	DownloadsSection,
	FeaturedLearnCardsSection,
	OfficialReleasesSection,
	PageHeader,
	SidecarMarketingCard,
}
