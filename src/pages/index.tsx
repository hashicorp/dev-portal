/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { getFeatureFlag } from 'lib/posthog'
import HomePageView from 'views/homepage'

export async function getServerSideProps(context) {
	const { req } = context
	const flag = await getFeatureFlag('bootstrap-testing', req)

	return {
		props: {
			bootstrapData: flag, // Pass as prop
		},
	}
}

export default HomePageView
