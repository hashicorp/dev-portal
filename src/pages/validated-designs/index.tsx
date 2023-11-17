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

	const data = getHvdLandingProps()

	/**
	 * If we are in content repos and the GITHUB_TOKEN is not wired up
	 * we don't want to render these pages because we don't have access to
	 * the hvd data
	 */
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
