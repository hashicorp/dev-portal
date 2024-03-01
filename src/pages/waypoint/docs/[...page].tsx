/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import DocsView from 'views/docs-view'
import { getRootDocsPathGenerationFunctions } from 'views/docs-view/utils/get-root-docs-path-generation-functions'

const { getStaticPaths, getStaticProps } = getRootDocsPathGenerationFunctions(
	'waypoint',
	'docs',
	{ hideVersionSelector: true }
)

export { getStaticProps, getStaticPaths }
export default DocsView
