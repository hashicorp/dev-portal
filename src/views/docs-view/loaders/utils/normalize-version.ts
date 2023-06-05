/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export const normalizeVersion = (version: string) => {
	if (version === 'latest') {
		return version
	}
	return version.startsWith('v') ? version : `v${version}`
}
