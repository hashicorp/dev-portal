/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'

export const ALL_PAGE_PATHS_OUTPUT_FOLDER = path.join(
	process.cwd(),
	'src',
	'.generated'
)

export const ALL_PAGE_PATHS_OUTPUT_FILE_PATH = path.join(
	ALL_PAGE_PATHS_OUTPUT_FOLDER,
	'all-page-paths-by-base-path.json'
)
