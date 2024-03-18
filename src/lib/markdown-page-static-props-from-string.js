/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { serialize } from 'lib/next-mdx-remote/serialize'
import markdownDefaults from '@hashicorp/platform-markdown-utils'
import matter from 'gray-matter'

// TODO: might be nice to move this into
// TODO: the markdown-page component instead...
// TODO: or maybe this is an appropriate thing to add
// TODO: to `@hashicorp/platform-markdown-utils`?
function markdownPageStaticPropsFromString(fileString) {
	return async function getStaticProps() {
		const { data, content } = matter(fileString)
		const mdxSource = await serialize(content, {
			mdxOptions: markdownDefaults(),
		})
		return {
			props: {
				staticProps: {
					mdxSource,
					head: {
						title: data.page_title || null,
						description: data.description || null,
					},
				},
			},
		}
	}
}

export default markdownPageStaticPropsFromString
