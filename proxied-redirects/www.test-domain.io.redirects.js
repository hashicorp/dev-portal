/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Test redirect, for use in e2e testing
 */
module.exports = [
	{
		source: '/source',
		destination: '/',
		permanent: true,
	},
]
