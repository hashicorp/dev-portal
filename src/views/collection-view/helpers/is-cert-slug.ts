/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export function isCertSlug(slug: string) {
	return /cert|certification/.test(slug)
}
