/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Replaces "HashiCorp Cloud Platform" with "HCP" in the given string.
 */
export function shortenHcp(s: string): string {
	return s.replace('HashiCorp Cloud Platform', 'HCP')
}
