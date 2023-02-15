/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { anchorLinks, paragraphCustomAlerts } from '@hashicorp/remark-plugins'
import rehypeSurfaceCodeNewlines from '@hashicorp/platform-code-highlighting/rehype-surface-code-newlines'
import rehypePrism from '@mapbox/rehype-prism'
import getVideoUrl from './get-video-url'
import { Tutorial as ClientTutorial } from 'lib/learn-client/types'
import { rewriteStaticAssetsPlugin } from 'lib/remark-plugins/rewrite-static-assets'
import { TableOfContentsHeading } from 'layouts/sidebar-sidecar/components/table-of-contents'
import { splitProductFromFilename } from '.'

export async function serializeContent(tutorial: ClientTutorial): Promise<{
	content: MDXRemoteSerializeResult
	headings: TableOfContentsHeading[]
}> {
	const video = tutorial?.video
	//  add `video` to MDX scope if the video is being displayed inline
	const scope = video?.videoInline
		? {
				video: getVideoUrl({
					videoId: video.id,
					videoHost: video.videoHost,
				}),
		  }
		: {}

	const tutorialFilename = splitProductFromFilename(tutorial.slug)
	// @TODO ask EDU if thats a problem, removing the overview
	const headings: TableOfContentsHeading[] = [
		{ title: tutorial.name, slug: tutorialFilename, level: 1 },
	]

	const content = await serialize(tutorial.content, {
		scope,
		mdxOptions: {
			remarkPlugins: [
				[anchorLinks, { headings }],
				paragraphCustomAlerts,
				rewriteStaticAssetsPlugin,
			],
			rehypePlugins: [
				[rehypePrism, { ignoreMissing: true }],
				rehypeSurfaceCodeNewlines,
			],
		},
	})

	return { content, headings }
}
