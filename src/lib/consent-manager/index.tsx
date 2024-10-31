/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { showBanner } from './utils'
import { ConsentManager as _ConsentManagerComponent } from './component'

type ConsentManagerOpts = {
	gtmId: string
}

const createConsentManager = ({ gtmId }: ConsentManagerOpts) => {
	return {
		openConsentManager: showBanner,
		ConsentManager: () => <_ConsentManagerComponent gtmId={gtmId} />,
	}
}

export { createConsentManager }
