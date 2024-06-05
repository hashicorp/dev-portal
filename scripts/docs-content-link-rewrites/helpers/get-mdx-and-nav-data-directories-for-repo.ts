/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Given a hashicorp repository name, return an object with two properties:
 *  - mdxPrefix: the filename prefix for MDX files
 *  - navDataPrefix: the filename prefix for nav data JSON files
 */
const getMdxAndNavDataDirectoriesForRepo = (repo: string) => {
	// The default values that most repos use
	let mdxPrefix = 'website/content'
	let navDataPrefix = 'website/data'

	// HCP and Terraform docs content repos use slightly different values
	// Note: cloud.hashicorp.com is being renamed to hcp-docs
	if (repo === 'cloud.hashicorp.com' || repo === 'hcp-docs') {
		mdxPrefix = 'content'
		navDataPrefix = 'data'
	} else if (repo.startsWith('terraform') || repo.startsWith('ptfe-releases')) {
		mdxPrefix = 'website/docs'
	}

	// Return the values in an object
	return { mdxPrefix, navDataPrefix }
}

export { getMdxAndNavDataDirectoriesForRepo }
