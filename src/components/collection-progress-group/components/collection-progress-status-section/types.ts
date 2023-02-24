/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export interface CollectionProgressStatusSectionProps {
	completedTutorialCount: number
	tutorialCount: number
	/**
	 * Optionally specify that the progress bar should be shown,
	 * even in cases where there are zero completed tutorials.
	 * Note that if all tutorials are completed, the progress
	 * bar will not be shown even if isInProgress is set to true.
	 */
	isInProgress?: boolean
}
