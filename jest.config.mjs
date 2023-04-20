/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/** @type {import('@jest/types').Config} */
const config = {
	// transform: { '^.+\\.tsx?$': ['ts-jest', { useESM: true }] },
	extensionsToTreatAsEsm: ['.ts'],
	testRegex: ['rehype-sanitize.test.ts$'],
}

export default config
