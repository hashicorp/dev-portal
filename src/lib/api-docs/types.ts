/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { GithubFile } from 'lib/fetch-github-file'

/**
 * A type to describe versioned API docs source files.
 */
export interface ApiDocsVersionData {
	// A unique id for this version, used to construct URL paths for example
	versionId: string
	// The release stage of this version of the API docs
	releaseStage?: string // typically 'stable' | 'preview'
	// The schema file we'll load and render into the page for this version
	targetFile: GithubFile | string
}
