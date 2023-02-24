/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ConsentManagerService } from '@hashicorp/react-consent-manager/types'

const localConsentManagerServices: ConsentManagerService[] = [
	{
		name: 'Demandbase Tag',
		description:
			'The Demandbase tag is a tracking service to identify website visitors and measure interest on our website.',
		category: 'Analytics',
		url: 'https://tag.demandbase.com/960ab0a0f20fb102.min.js',
		async: true,
	},
]

export default localConsentManagerServices
