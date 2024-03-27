/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getHvdCategoryGroups } from 'views/validated-designs/server'
import ValidatedDesignsLandingView from 'views/validated-designs'
import { getHvdExtractionStatus } from '@scripts/extract-hvd-content'

export async function getStaticProps() {
	const extractionResults = await getHvdExtractionStatus()
	if (extractionResults.status === 'failure') {
		return {
			notFound: true,
		}
	}

	const categoryGroups = getHvdCategoryGroups()
	if (!categoryGroups) {
		return {
			notFound: true,
		}
	}

	return {
		props: {
			metadata: {
				title: 'HashiCorp Validated Designs',
				description: 'HashiCorp Validated Designs',
			},
			categoryGroups,
		},
	}
}

export default ValidatedDesignsLandingView
