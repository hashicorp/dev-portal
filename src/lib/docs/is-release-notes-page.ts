/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Hide the version selector on TFE release notes page, e.g. /terraform/enterprise/<year>/<version> or /vault/docs/release-notes/1.13.0
export const isReleaseNotesPage = (path: string) =>
	/(\/releases\/\d{4}\/(v\d{6}-\d{1}))$/i.test(path) ||
	/\/release-notes\/(v\d+[.|_]|(\d+[.|_]))\d+[.|_]([0-9]|x)$/i.test(path)
		? true
		: false
