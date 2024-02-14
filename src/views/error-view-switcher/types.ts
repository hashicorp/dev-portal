/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export interface ErrorPageProps {
	/**
	 * Error code to be recorded via window.analytics.track
	 */
	statusCode: number
}
