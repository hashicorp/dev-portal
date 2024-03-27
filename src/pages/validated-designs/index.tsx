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
		if (!process.env.IS_CONTENT_PREVIEW) {
			// We need to throw an error here because next.js does not fail to build when modules, such as getHvdExtractionStatus, error out
			throw new Error('Failed to extract HVD content')
		}

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
