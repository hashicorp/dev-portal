/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getHvdLandingProps } from 'views/validated-designs/server'
import ValidatedDesignsLandingView from 'views/validated-designs'

export async function getStaticProps() {
	/** TODO remove this conditional after release */
	if (__config.flags.enable_hvd === false) {
		return {
			notFound: true,
		}
	}

	const data = getHvdLandingProps()

	return {
		props: { title: 'HVD', _tmp: data },
	}
}

export default ValidatedDesignsLandingView
