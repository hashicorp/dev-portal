/**Add a comment on  lines R1 to R4Add diff commentMarkdown input:  edit mode selected.WritePreviewAdd a suggestionHeadingBoldItalicQuoteCodeLinkUnordered listNumbered listTask listMentionReferenceMore Formatting tools items 4Saved repliesAdd FilesPaste, drop, or click to add filesCancelCommentStart a review
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import DocsView from 'views/docs-view'
import { getRootDocsPathGenerationFunctions } from 'views/docs-view/utils/get-root-docs-path-generation-functions'

const { getStaticPaths, getStaticProps } = getRootDocsPathGenerationFunctions(
	'vault-radar',
	'hcp-docs'
)

export { getStaticProps, getStaticPaths }
export default DocsView