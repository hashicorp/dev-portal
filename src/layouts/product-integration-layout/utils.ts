/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export function lastUpdatedString(updatedAtString: string) {
	const updatedAt = new Date(updatedAtString)
	const currentTime: Date = new Date()

	// Calculate the total number of days that have passed since the last update
	const days = Math.floor(
		(currentTime.getTime() - updatedAt.getTime()) / 1000 / 86400
	)

	// For days
	if (days < 7) {
		if (days < 1) {
			return 'Updated today'
		} else if (days === 1) {
			return 'Updated yesterday'
		} else {
			return `Updated ${days} days ago`
		}
	}

	// Weeks
	const weeks = Math.ceil(days / 7)
	if (weeks < 4) {
		if (weeks === 1) {
			return 'Updated last week'
		} else {
			return `Updated ${weeks} weeks ago`
		}
	}

	// Months
	const AVERAGE_MONTH_LENGTH = 30.4167
	const months = Math.ceil(days / AVERAGE_MONTH_LENGTH)
	if (months < 12) {
		if (months === 1) {
			return 'Updated last month'
		} else {
			return `Updated ${months} months ago`
		}
	}

	// Years
	const years = Math.ceil(days / 365.25)
	if (years === 1) {
		return 'Updated last year'
	} else {
		return `Updated ${years} years ago`
	}
}

export function versionString(version: string, allVersions: string[]): string {
	if (version === allVersions[0]) {
		return `v${version} (latest)`
	} else {
		return `v${version}`
	}
}
