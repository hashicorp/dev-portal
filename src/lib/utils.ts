/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export const chunk = <T>(arr: T[], chunkSize = 1, cache: T[][] = []): T[][] => {
	const tmp = [...arr]
	if (chunkSize <= 0) {
		return cache
	}
	while (tmp.length) {
		cache.push(tmp.splice(0, chunkSize))
	}
	return cache
}

export const isCertificationSlug = (slug: string): boolean => {
	return /certifications|cert/.test(slug)
}
