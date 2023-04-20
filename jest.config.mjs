/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/** @type {import('@jest/types').Config} */
const config = {
	extensionsToTreatAsEsm: ['.ts'],
	testRegex: ['rehype-sanitize.test.ts$'],
}

export default config
