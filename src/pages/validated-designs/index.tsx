/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getHvdCategoryGroups } from 'views/validated-designs/server'
import ValidatedDesignsLandingView from 'views/validated-designs'

export async function getStaticProps() {
	/** @TODO remove this conditional after release */
	if (__config.flags.enable_hvd === false) {
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
			categoryGroups,
		},
	}
}

export default ValidatedDesignsLandingView
