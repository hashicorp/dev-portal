/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getHvdLandingProps } from 'views/validated-designs/server'
import ValidatedDesignsLandingView from 'views/validated-designs'

export async function getStaticProps() {
	/** @TODO remove this conditional after release */
	if (__config.flags.enable_hvd === false) {
		return {
			notFound: true,
		}
	}

	// Adding this catch here to workaround content migration
	// and dependent builds between the content repo. This should be reworked
	let data

	try {
		data = getHvdLandingProps()
	} catch (e) {
		console.log('Could not fetch HVD data ', e)
	}

	if (!data) {
		return {
			notFound: true,
		}
	}

	return {
		props: data,
	}
}

export default ValidatedDesignsLandingView
