/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import fetchGithubFile from '@build-libs/fetch-github-file'

export type fileContentEntry = {
	title?: string
	routes?: fileContentEntry[]
	divider?: boolean
	path?: string
	href?: string
	badge?: {
		text: string
		color: string
		type: string
	}
	hidden?: boolean
}

const fetchNavDataForBasePathAndRepo = async ({
	filePath,
	repo,
}: {
	filePath: string
	repo: string
}) => {
	// The function referenced is not in TS, and this code is temporary
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const fileContents = await fetchGithubFile({
		owner: 'hashicorp',
		repo,
		path: filePath,
	})
	return JSON.parse(fileContents) as fileContentEntry[]
}

export { fetchNavDataForBasePathAndRepo }
