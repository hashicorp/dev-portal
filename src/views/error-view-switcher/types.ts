/**
 * Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

export interface ErrorPageProps {
	/**
	 * Error code to be recorded via window.analytics.track
	 */
	statusCode: number
}
